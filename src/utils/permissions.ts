import type { UserRole } from '@/types'

const ADMIN_PANEL_ROLES: UserRole[] = ['gestor', 'administrador']

export function canAccessAdminPanel(role: UserRole | undefined): boolean {
  return role !== undefined && ADMIN_PANEL_ROLES.includes(role)
}

export const ROLE_LABELS: Record<UserRole, string> = {
  visitante: 'Visitante',
  usuario: 'Usuário',
  gestor: 'Gestor',
  administrador: 'Administrador',
}
