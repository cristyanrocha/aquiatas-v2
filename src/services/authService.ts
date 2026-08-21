import type { AuthenticatedUser, LoginCredentials, RegisterData } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { mapProfileToUser } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'

export const EMAIL_ALREADY_REGISTERED_MESSAGE = 'Já existe uma conta cadastrada com este e-mail.'
const INACTIVE_ACCOUNT_MESSAGE = 'Esta conta está desativada. Entre em contato com o administrador.'
const BLOCKED_ACCOUNT_MESSAGE = 'Esta conta foi bloqueada. Entre em contato com o administrador.'

export interface RegisterResult {
  user: AuthenticatedUser | null
  needsEmailConfirmation: boolean
}

async function fetchOwnProfile(): Promise<AuthenticatedUser | null> {
  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', authData.user.id)
    .maybeSingle()

  if (error) throw new Error(translateSupabaseError(error))
  return data ? mapProfileToUser(data) : null
}

function assertAccountIsUsable(user: AuthenticatedUser) {
  if (user.status === 'blocked') throw new Error(BLOCKED_ACCOUNT_MESSAGE)
  if (user.status === 'inactive') throw new Error(INACTIVE_ACCOUNT_MESSAGE)
}

export const authService = {
  async login({ email, senha }: LoginCredentials): Promise<AuthenticatedUser> {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    })
    if (error) throw new Error(translateSupabaseError(error))

    const profile = await fetchOwnProfile()
    if (!profile) {
      await supabase.auth.signOut()
      throw new Error('Não foi possível carregar seu perfil. Tente novamente.')
    }

    try {
      assertAccountIsUsable(profile)
    } catch (error) {
      await supabase.auth.signOut()
      throw error
    }

    return profile
  },

  async register(data: RegisterData): Promise<RegisterResult> {
    const email = data.email.trim().toLowerCase()
    const nome = data.nome.trim().replace(/\s+/g, ' ')
    const orgaoPublico = data.orgaoPublico.trim()

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password: data.senha,
      options: {
        data: { name: nome, phone: data.telefone ?? null, public_agency_name: orgaoPublico },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      if (/already registered|already exists/i.test(error.message)) {
        throw new Error(EMAIL_ALREADY_REGISTERED_MESSAGE)
      }
      throw new Error(translateSupabaseError(error))
    }

    // Supabase Auth returns a user with no identities when the email is already
    // registered but re-signup email leakage protection is enabled — treat as taken.
    if (signUpData.user && signUpData.user.identities?.length === 0) {
      throw new Error(EMAIL_ALREADY_REGISTERED_MESSAGE)
    }

    if (signUpData.session) {
      const profile = await fetchOwnProfile()
      return { user: profile, needsEmailConfirmation: false }
    }

    return { user: null, needsEmailConfirmation: true }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(translateSupabaseError(error))
  },

  async getCurrentUser(): Promise<AuthenticatedUser | null> {
    return fetchOwnProfile()
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    })
    if (error) throw new Error(translateSupabaseError(error))
  },

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(translateSupabaseError(error))
  },

  /** Self-service edit of the signed-in user's own profile — never touches role/status/email. */
  async updateOwnProfile(input: { nome: string; telefone?: string; orgaoPublico: string }): Promise<AuthenticatedUser> {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) throw new Error('Sessão não encontrada. Faça login novamente.')

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name: input.nome.trim().replace(/\s+/g, ' '),
        phone: input.telefone?.trim() || null,
        public_agency_name: input.orgaoPublico.trim(),
      })
      .eq('auth_user_id', authData.user.id)
      .select()
      .single()

    if (error) throw new Error(translateSupabaseError(error))
    return mapProfileToUser(data)
  },
}
