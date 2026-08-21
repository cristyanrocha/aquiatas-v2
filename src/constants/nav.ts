import { ROUTES } from './routes'

export interface NavLink {
  label: string
  href: string
}

export const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: 'Início', href: ROUTES.home },
  { label: 'Parceiros', href: ROUTES.parceiros },
  { label: 'Órgãos Públicos', href: ROUTES.orgaos },
  { label: 'Quem Somos', href: ROUTES.quemSomos },
  { label: 'Planos e Preços', href: ROUTES.precos },
  { label: 'Contato', href: ROUTES.contato },
]
