import type { Plan, PlanId } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'

const CTA_LABELS: Record<PlanId, string> = {
  gratuito: 'Começar grátis',
  lancamento: 'Escolher plano',
  personalizado: 'Falar com vendas',
}

function splitFeatures(description: string): string[] {
  const withoutPeriod = description.trim().replace(/\.$/, '')
  const normalized = withoutPeriod.replace(/,? e (?=[^,]+$)/, ', ')
  return normalized.split(',').map((item) => item.trim()).filter(Boolean)
}

function formatPrice(price: number | null): { precoLabel: string; descricaoPagamento: string } {
  if (price === null) return { precoLabel: 'Consultar', descricaoPagamento: 'Sob consulta' }
  if (price === 0) return { precoLabel: 'R$ 0', descricaoPagamento: 'Sem Custo' }
  return {
    precoLabel: price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
    descricaoPagamento: 'Pagamento Único',
  }
}

export const planService = {
  async list(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
    if (error) throw new Error(translateSupabaseError(error))

    return (data ?? []).map((row) => {
      const id = row.slug as PlanId
      const price = row.price !== null ? Number(row.price) : null
      const { precoLabel, descricaoPagamento } = formatPrice(price)
      return {
        id,
        nome: row.name,
        preco: price,
        precoLabel,
        descricaoPagamento,
        limiteItens: row.item_limit,
        limiteItensLabel: row.item_limit ? `Até ${row.item_limit} ${row.item_limit > 1 ? 'itens' : 'item'}` : 'Mais de 7 itens',
        recomendado: row.is_featured,
        recursos: splitFeatures(row.description ?? ''),
        ctaLabel: CTA_LABELS[id] ?? 'Saiba mais',
      }
    })
  },
}
