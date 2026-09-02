import { Compass, Eye, Target } from 'lucide-react'
import { Seo, SocialIconLink } from '@/components/common'
import { SOCIAL_LINKS } from '@/constants/social'

export function QuemSomosPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo
        title="Quem Somos"
        description="Conheça a história, missão, visão e valores da AquiAtas, a vitrine digital das Atas de Registro de Preços."
        path="/quem-somos"
      />

      <h1 className="text-center font-display text-3xl font-semibold text-foreground sm:text-4xl">Quem Somos</h1>

      <div className="mt-10">
        <div className="flex flex-col gap-4 text-left text-sm leading-relaxed text-muted-foreground sm:text-base">
          <p>
            Acreditamos que o acesso às informações públicas deve ser simples, ágil e transparente. No entanto,
            empresas e órgãos públicos ainda enfrentam dificuldades para localizar Atas de Registro de Preços
            vigentes, o que gera perda de tempo, reduz oportunidades de negócios e torna os processos de contratação
            menos eficientes.
          </p>
          <p>
            Foi para transformar essa realidade que nasceu a AquiAtas: uma plataforma que conecta empresas, produtos
            e órgãos públicos em um único ambiente digital, facilitando a consulta e a divulgação de Atas de Registro
            de Preços. Para os órgãos públicos, a utilização é totalmente gratuita, proporcionando acesso rápido e
            centralizado às informações. Para as empresas, oferecemos um modelo simples, com pagamento único e
            validade durante toda a vigência da Ata de Registro de Preços, garantindo maior visibilidade para seus
            produtos e ampliando suas oportunidades no mercado público.
          </p>
          <p className="border-l-2 border-action py-1 pl-4 text-base font-medium text-foreground sm:text-lg">
            Nosso propósito é tornar as compras públicas mais acessíveis, promovendo eficiência, transparência e
            praticidade para quem compra, além de ampliar a visibilidade e as oportunidades para quem vende.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-lg bg-action-soft text-action">
            <Target className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Missão</h2>
          <p className="text-sm text-muted-foreground">
            Facilitar o acesso a Atas de Registro de Preços vigentes, promovendo transparência e eficiência nas
            contratações públicas.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-lg bg-action-soft text-action">
            <Eye className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Visão</h2>
          <p className="text-sm text-muted-foreground">
            Ser a principal referência digital em divulgação de Atas de Registro de Preços do Brasil.
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-lg bg-action-soft text-action">
            <Compass className="size-5" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Valores</h2>
          <p className="text-sm text-muted-foreground">
            Atuamos com Transparência, Simplicidade e Eficiência, buscando tornar o acesso às informações sobre Atas
            de Registro de Preços mais claro, organizado e acessível, contribuindo para conexões mais eficientes
            entre órgãos públicos, empresas e oportunidades.
          </p>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <h2 className="text-sm font-semibold text-foreground">Siga a AquiAtas</h2>
        <div className="flex gap-2">
          {SOCIAL_LINKS.map((social) => (
            <SocialIconLink key={social.icon} social={social} />
          ))}
        </div>
      </div>
    </div>
  )
}
