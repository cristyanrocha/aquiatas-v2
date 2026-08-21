export type UserRole = 'visitante' | 'usuario' | 'gestor' | 'administrador'
export type UserStatus = 'active' | 'inactive' | 'blocked'

export interface User {
  id: string
  /** Supabase Auth user id (auth.users.id). Credentials live entirely in Supabase Auth, never here. */
  authUserId: string
  nome: string
  email: string
  telefone?: string
  /** Free-text agency name the user self-declared — not a reference to the Órgãos Públicos registry. */
  orgaoPublico: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

/** What the UI holds about the signed-in user. */
export type AuthenticatedUser = User

export interface AuthState {
  isAuthenticated: boolean
  user: AuthenticatedUser | null
}

/** Payload accepted by authService.register(). The public flow never supplies role/ativo. */
export interface RegisterData {
  nome: string
  email: string
  telefone?: string
  orgaoPublico: string
  senha: string
}

export interface LoginCredentials {
  email: string
  senha: string
}

export interface RegisterFormData {
  nome: string
  email: string
  telefone: string
  orgaoPublico: string
  senha: string
  confirmarSenha: string
  aceitarTermos: boolean
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>
