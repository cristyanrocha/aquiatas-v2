import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { AuthenticatedUser, RegisterData, UserRole } from '@/types'
import { authService, type RegisterResult } from '@/services/authService'
import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { toast } from 'sonner'

interface AuthContextValue {
  user: AuthenticatedUser | null
  /** Alias of `user` — same profile record, kept for parity with the spec's naming. */
  profile: AuthenticatedUser | null
  session: Session | null
  role: UserRole | null
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (data: RegisterData) => Promise<RegisterResult>
  logout: () => Promise<void>
  signIn: (email: string, senha: string) => Promise<void>
  signUp: (data: RegisterData) => Promise<RegisterResult>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  updateProfile: (input: { nome: string; telefone?: string; orgaoPublico: string }) => Promise<void>
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function loadProfileOrSignOut(): Promise<AuthenticatedUser | null> {
  const user = await authService.getCurrentUser()
  if (!user) return null
  if (user.status !== 'active') {
    await supabase.auth.signOut()
    toast.error(
      user.status === 'blocked'
        ? 'Esta conta foi bloqueada. Entre em contato com o administrador.'
        : 'Esta conta está desativada. Entre em contato com o administrador.',
    )
    return null
  }
  return user
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const hasResolvedInitialSession = useRef(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)

      if (event === 'SIGNED_OUT') {
        setUser(null)
        if (!hasResolvedInitialSession.current) {
          hasResolvedInitialSession.current = true
          setIsLoading(false)
        }
        return
      }

      if (!nextSession) {
        setUser(null)
        if (!hasResolvedInitialSession.current) {
          hasResolvedInitialSession.current = true
          setIsLoading(false)
        }
        return
      }

      // Defer the profile lookup so it never runs synchronously inside the
      // Supabase auth callback (that can deadlock the client).
      setTimeout(() => {
        loadProfileOrSignOut()
          .then(setUser)
          .finally(() => {
            if (!hasResolvedInitialSession.current) {
              hasResolvedInitialSession.current = true
              setIsLoading(false)
            }
          })
      }, 0)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true)
    try {
      const loggedInUser = await authService.login({ email, senha })
      setUser(loggedInUser)
      toast.success(`Bem-vindo(a), ${loggedInUser.nome.split(' ')[0]}!`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (data: RegisterData): Promise<RegisterResult> => {
    setIsLoading(true)
    try {
      const result = await authService.register(data)
      if (result.user) {
        setUser(result.user)
        toast.success('Conta criada com sucesso!')
      } else {
        toast.success('Conta criada! Verifique seu e-mail para confirmar o cadastro.')
      }
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    toast.success('Você saiu da sua conta.')
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await authService.requestPasswordReset(email)
  }, [])

  const resendConfirmationEmail = useCallback(async (email: string) => {
    await authService.resendConfirmationEmail(email)
  }, [])

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      await authService.updatePassword(newPassword)
      toast.success('Senha atualizada com sucesso.')
    } catch (error) {
      toast.error(translateSupabaseError(error))
      throw error
    }
  }, [])

  const updateProfile = useCallback(async (input: { nome: string; telefone?: string; orgaoPublico: string }) => {
    const updated = await authService.updateOwnProfile(input)
    setUser(updated)
    toast.success('Perfil atualizado com sucesso.')
  }, [])

  const refreshProfile = useCallback(async () => {
    const refreshed = await loadProfileOrSignOut()
    setUser(refreshed)
  }, [])

  const role = user?.role ?? null

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile: user,
      session,
      role,
      isAuthenticated: user !== null,
      isAdmin: role === 'administrador',
      isManager: role === 'gestor',
      isLoading,
      login,
      register,
      logout,
      signIn: login,
      signUp: register,
      signOut: logout,
      resetPassword,
      resendConfirmationEmail,
      updatePassword,
      updateProfile,
      refreshProfile,
    }),
    [
      user,
      session,
      role,
      isLoading,
      login,
      register,
      logout,
      resetPassword,
      resendConfirmationEmail,
      updatePassword,
      updateProfile,
      refreshProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
