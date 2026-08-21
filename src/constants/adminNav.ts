import type { LucideIcon } from 'lucide-react'
import { LayoutDashboard, FileStack, Building2, Tags, ListTree, Landmark, Users } from 'lucide-react'
import { ROUTES } from './routes'

export interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: 'Dashboard', href: ROUTES.adminDashboard, icon: LayoutDashboard },
  { label: 'Itens das Atas', href: ROUTES.adminAtas, icon: FileStack },
  { label: 'Parceiros', href: ROUTES.adminParceiros, icon: Building2 },
  { label: 'Categorias', href: ROUTES.adminCategorias, icon: Tags },
  { label: 'Tipos de Ata', href: ROUTES.adminTipos, icon: ListTree },
  { label: 'Órgãos', href: ROUTES.adminOrgaos, icon: Landmark },
  { label: 'Usuários', href: ROUTES.adminUsuarios, icon: Users },
]
