import type { AtaSituacao } from '@/types'
import { daysUntil } from './format'

const PROXIMO_VENCIMENTO_DIAS = 30

export function calcularSituacaoAta(dataVigenciaFim: string): AtaSituacao {
  const dias = daysUntil(dataVigenciaFim)
  if (dias < 0) return 'vencida'
  if (dias <= PROXIMO_VENCIMENTO_DIAS) return 'proxima_vencimento'
  return 'vigente'
}

export const SITUACAO_LABELS: Record<AtaSituacao, string> = {
  vigente: 'Vigente',
  proxima_vencimento: 'Próxima do vencimento',
  vencida: 'Vencida',
}
