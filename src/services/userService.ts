import type { User, UserRole, UserStatus } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { mapProfileToUser, mapUiRoleToDb, toDbId } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { createListStore } from './createStore'

async function list(): Promise<User[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapProfileToUser)
}

export const userStore = createListStore(list)

interface AdminUsersResponse {
  success: boolean
  error?: string
  data?: Record<string, unknown>
}

async function callAdminUsers(action: string, payload: Record<string, unknown>): Promise<AdminUsersResponse> {
  const { data, error } = await supabase.functions.invoke<AdminUsersResponse>('admin-users', {
    body: { action, ...payload },
  })
  if (error) throw new Error(translateSupabaseError(error))
  if (!data?.success) throw new Error(data?.error ?? 'Não foi possível concluir a operação.')
  return data
}

export interface UserCreateInput {
  nome: string
  email: string
  telefone?: string
  orgaoPublico: string
  role: UserRole
}

export interface UserUpdateInput {
  nome?: string
  telefone?: string
  orgaoPublico?: string
  role?: UserRole
}

export const userService = {
  list,

  async getById(id: string): Promise<User | undefined> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', toDbId(id)).maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapProfileToUser(data) : undefined
  },

  async getByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapProfileToUser(data) : undefined
  },

  /** Invites a new user by email — they set their own password via the invite link (no plaintext password is ever handled here). */
  async create(input: UserCreateInput): Promise<void> {
    await callAdminUsers('create', {
      name: input.nome,
      email: input.email,
      phone: input.telefone,
      public_agency_name: input.orgaoPublico,
      role: mapUiRoleToDb(input.role),
    })
    void userStore.refresh()
  },

  async update(id: string, input: UserUpdateInput): Promise<void> {
    await callAdminUsers('update', {
      profile_id: toDbId(id),
      name: input.nome,
      phone: input.telefone,
      public_agency_name: input.orgaoPublico,
      role: input.role ? mapUiRoleToDb(input.role) : undefined,
    })
    void userStore.refresh()
  },

  async updateEmail(id: string, email: string): Promise<void> {
    await callAdminUsers('update_email', { profile_id: toDbId(id), email })
    void userStore.refresh()
  },

  async setStatus(id: string, status: UserStatus): Promise<void> {
    await callAdminUsers('set_status', { profile_id: toDbId(id), status })
    void userStore.refresh()
  },

  async remove(id: string): Promise<void> {
    await callAdminUsers('delete', { profile_id: toDbId(id) })
    void userStore.refresh()
  },

  /** Sends the user a password-reset email — an admin never sets another person's password directly. */
  async sendPasswordReset(id: string): Promise<void> {
    await callAdminUsers('reset_password', { profile_id: toDbId(id) })
  },
}
