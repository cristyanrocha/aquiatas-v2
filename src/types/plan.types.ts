export type PlanId = 'gratuito' | 'lancamento' | 'personalizado'

export interface Plan {
  id: PlanId
  nome: string
  preco: number | null
  precoLabel: string
  descricaoPagamento: string
  limiteItens: number | null
  limiteItensLabel: string
  recomendado: boolean
  recursos: string[]
  ctaLabel: string
}

export interface FaqItem {
  id: string
  pergunta: string
  resposta: string
}
