/**
 * Reference credentials for the three demo accounts described in the project docs.
 * These accounts must be created manually in the Supabase Dashboard (Authentication →
 * Users) with these exact emails/passwords — see supabase/README.md for the steps and
 * the SQL to assign each one its role afterwards.
 */
export const ADMIN_EMAIL = 'admin@aquiatas.com.br'
export const GESTOR_DEMO_EMAIL = 'gestor@aquiatas.com.br'
export const USUARIO_DEMO_EMAIL = 'usuario@aquiatas.com.br'

export const DEMO_ACCOUNTS = [
  { label: 'Administrador', email: ADMIN_EMAIL, senha: 'Admin@123' },
  { label: 'Gestor', email: GESTOR_DEMO_EMAIL, senha: 'Gestor@123' },
  { label: 'Usuário', email: USUARIO_DEMO_EMAIL, senha: 'Usuario@123' },
] as const
