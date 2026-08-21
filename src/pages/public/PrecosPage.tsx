import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Seo } from '@/components/common'
import { cn } from '@/lib/utils'
import { pricingFaq } from '@/mocks/plans'
import { planService } from '@/services/planService'
import type { Plan } from '@/types'
import { getWhatsAppUrl, PLAN_WHATSAPP_MESSAGES } from '@/constants/social'

export function PrecosPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    planService
      .list()
      .then(setPlans)
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo
        title="Preços"
        description="Conheça os planos da AquiAtas para divulgar suas Atas de Registro de Preços: Gratuito, Lançamento e Personalizado."
        path="/precos"
      />

      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Planos e Preços</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
          Escolha o plano ideal para divulgar suas Atas de Registro de Preços e ganhar visibilidade no mercado público.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
        {isLoading && <p className="col-span-full text-center text-sm text-muted-foreground">Carregando planos...</p>}
        {!isLoading && plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col gap-5 rounded-2xl border p-6 transition-all duration-200',
              plan.recomendado
                ? 'border-brand bg-card shadow-xl md:-translate-y-2 md:p-8'
                : 'border-border bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-md',
            )}
          >
            {plan.recomendado && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                Mais Escolhido
              </span>
            )}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{plan.nome}</h2>
              <p className="text-xs text-muted-foreground">{plan.limiteItensLabel}</p>
            </div>
            <div>
              <span className="text-3xl font-semibold text-brand">{plan.precoLabel}</span>
              <p className="text-xs text-muted-foreground">{plan.descricaoPagamento}</p>
            </div>
            <ul className="flex flex-1 flex-col gap-2.5">
              {plan.recursos.map((recurso) => (
                <li key={recurso} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {recurso}
                </li>
              ))}
            </ul>
            <Button asChild variant={plan.recomendado ? 'default' : 'outline'} className="w-full">
              <a href={getWhatsAppUrl(PLAN_WHATSAPP_MESSAGES[plan.id])} target="_blank" rel="noopener noreferrer">
                {plan.ctaLabel}
              </a>
            </Button>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-2xl">
        <h2 className="mb-4 text-center font-display text-lg font-semibold text-foreground">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full rounded-xl border border-border bg-card px-2 shadow-sm">
          {pricingFaq.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.pergunta}</AccordionTrigger>
              <AccordionContent>{item.resposta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
