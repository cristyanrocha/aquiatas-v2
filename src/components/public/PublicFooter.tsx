import { Link } from 'react-router-dom'
import { FileStack } from 'lucide-react'
import { PUBLIC_NAV_LINKS } from '@/constants/nav'
import { SOCIAL_LINKS } from '@/constants/social'
import { SocialIcon } from '@/components/common/SocialIcon'
import { ROUTES } from '@/constants/routes'

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 font-semibold text-brand">
              <FileStack className="size-6" aria-hidden="true" />
              <span className="text-lg tracking-tight">AquiAtas</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              A vitrine digital das Atas de Registro de Preços do Brasil.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Navegação</h3>
            <ul className="flex flex-col gap-2">
              {PUBLIC_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to={ROUTES.termosDeUso} className="text-sm text-muted-foreground hover:text-foreground">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to={ROUTES.politicaDePrivacidade} className="text-sm text-muted-foreground hover:text-foreground">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Redes sociais</h3>
            <ul className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.icon}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-brand hover:bg-primary-light hover:text-brand"
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} AquiAtas. Todos os direitos reservados.</p>
          <p>Feito com transparência para o setor público.</p>
        </div>
      </div>
    </footer>
  )
}
