import { Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AtaSituacao } from '@/types'
import { SITUACAO_LABELS } from '@/utils/ataStatus'

const SITUACAO_STYLES: Record<AtaSituacao, string> = {
  vigente: 'bg-success/10 text-success border-success/20',
  proxima_vencimento: 'bg-warning/10 text-warning-foreground border-warning/30',
  vencida: 'bg-destructive/10 text-destructive border-destructive/20',
}

const SITUACAO_DOT: Record<AtaSituacao, string> = {
  vigente: 'fill-success text-success',
  proxima_vencimento: 'fill-warning text-warning',
  vencida: 'fill-destructive text-destructive',
}

export function StatusBadge({ situacao, className }: { situacao: AtaSituacao; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        SITUACAO_STYLES[situacao],
        className,
      )}
    >
      <Circle className={cn('size-2', SITUACAO_DOT[situacao])} aria-hidden="true" />
      {SITUACAO_LABELS[situacao]}
    </span>
  )
}
