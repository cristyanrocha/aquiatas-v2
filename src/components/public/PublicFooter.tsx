import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { SOCIAL_LINKS, getWhatsAppUrl } from '@/constants/social'
import { SocialIconLink } from '@/components/common'
import { ROUTES } from '@/constants/routes'

const PLATFORM_LINKS = [
  { label: 'Buscar Atas', href: ROUTES.home, onClick: () => window.scrollTo(0, 0) },
  { label: 'Parceiros', href: ROUTES.parceiros },
  { label: 'Órgãos Públicos', href: ROUTES.orgaos },
  { label: 'Planos e Preços', href: ROUTES.precos },
]

const LEGAL_LINKS = [
  { label: 'Termos de Uso', href: ROUTES.termosDeUso },
  { label: 'Política de Privacidade', href: ROUTES.politicaDePrivacidade },
]

function FooterLinkList({ links }: { links: { label: string; href: string; onClick?: () => void }[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            to={link.href}
            onClick={link.onClick}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3 pr-4">
            <a href="/" className="flex items-center">
              <img src="/images/logo.png" alt="AquiAtas" className="h-7 w-auto" />
            </a>
            <p className="max-w-xs text-sm text-muted-foreground">
              A vitrine digital que conecta órgãos públicos e fornecedores às Atas de Registro de Preços em todo o
              Brasil, com simplicidade, transparência e eficiência.
            </p>
            <ul className="mt-1 flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.icon}>
                  <SocialIconLink social={social} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterLinkList links={[{ label: 'Quem Somos', href: ROUTES.quemSomos }, { label: 'Contato', href: ROUTES.contato }]} />
          </div>

          <div>
            <FooterLinkList links={PLATFORM_LINKS} />
          </div>

          <div>
            <FooterLinkList links={LEGAL_LINKS} />
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
              Fale pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} AquiAtas. Todos os direitos reservados.</p>
          <p>Feito com transparência para o setor público.</p>
        </div>
      </div>
    </footer>
  )
}
