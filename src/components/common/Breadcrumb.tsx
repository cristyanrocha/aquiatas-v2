import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const SEGMENT_LABELS: Record<string, string> = {
  parceiros: 'Parceiros',
  orgaos: 'Órgãos Públicos',
  'quem-somos': 'Quem Somos',
  precos: 'Preços',
  contato: 'Contato',
  login: 'Entrar',
  cadastro: 'Criar Conta',
  'criar-conta': 'Criar Conta',
  'termos-de-uso': 'Termos de Uso',
  'politica-de-privacidade': 'Política de Privacidade',
  'esqueci-minha-senha': 'Esqueci Minha Senha',
  'meu-perfil': 'Meu Perfil',
  'redefinir-senha': 'Redefinir Senha',
  auth: 'Autenticação',
  callback: 'Confirmação',
  atas: 'Atas',
  admin: 'Painel Administrativo',
  novo: 'Novo',
  editar: 'Editar',
  usuarios: 'Usuários',
  categorias: 'Categorias',
  marcas: 'Marcas',
  tipos: 'Tipos de Ata',
}

function labelFor(segment: string): string {
  return SEGMENT_LABELS[segment] ?? decodeURIComponent(segment).replace(/-/g, ' ')
}

interface AppBreadcrumbProps {
  overrides?: Record<string, string>
  className?: string
}

export function AppBreadcrumb({ overrides, className }: AppBreadcrumbProps) {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <BreadcrumbRoot className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" aria-label="Início">
              <Home className="size-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const label = overrides?.[segment] ?? labelFor(segment)
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={href} className="capitalize">
                      {label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
}
