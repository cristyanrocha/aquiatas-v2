import { useEffect, useRef, useState } from 'react'
import { Building2, Calendar, FileText, Package, Tag } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { StatusBadge, DetailRow } from '@/components/common'
import { AtaPartnerSection } from './AtaPartnerSection'
import { useAuth } from '@/hooks/useAuth'
import { ataService } from '@/services/ataService'
import type { AtaDetail, AtaWithRelations } from '@/types'
import { formatCurrencyBRL, formatDateBR, formatNumberBR } from '@/utils/format'

interface AtaDetailsModalProps {
  ata: AtaWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AtaDetailsModal({ ata, open, onOpenChange }: AtaDetailsModalProps) {
  const { isAuthenticated } = useAuth()
  const [detail, setDetail] = useState<AtaDetail | null>(null)
  const viewedAtaIdRef = useRef<string | null>(null)

  // Re-fetches whenever auth state flips (login/logout) while the modal stays open, so the
  // partner section (server-gated by is_active_user()) updates without closing and reopening.
  useEffect(() => {
    if (!open || !ata) {
      setDetail(null)
      viewedAtaIdRef.current = null
      return
    }
    let cancelled = false
    ataService.getBySlugWithRelations(ata.slug).then((found) => {
      if (cancelled) return
      setDetail(found ?? null)
      if (found && viewedAtaIdRef.current !== found.id) {
        viewedAtaIdRef.current = found.id
        void ataService.incrementView(found.id)
      }
    })
    return () => {
      cancelled = true
    }
  }, [open, ata, isAuthenticated])

  if (!ata) return null
  const view = detail ?? ata

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="pr-6 text-left text-lg">{view.descricao}</DialogTitle>
          <DialogDescription className="text-left">
            Pregão {detail?.numeroAta || '—'} • {view.orgaoNome}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border border-border">
          <img src={view.imagemUrl} alt={view.descricao} className="aspect-video w-full object-cover" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Identificação
            </h2>
            <StatusBadge situacao={view.situacao} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={Tag} label="Marca" value={view.marcaNome} />
            <DetailRow icon={Package} label="Categoria" value={view.categoriaNome} />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h2 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Informações da Ata
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={FileText} label="Pregão" value={detail?.numeroAta || '—'} />
            <DetailRow icon={Building2} label="Órgão" value={view.orgaoNome} />
            <DetailRow icon={Package} label="Tipo de Ata" value={view.tipoNome} />
            <DetailRow icon={Calendar} label="Vigência" value={`${formatDateBR(view.dataVigenciaInicio)} a ${formatDateBR(view.dataVigenciaFim)}`} />
            <DetailRow icon={Package} label="Quantidade registrada" value={`${formatNumberBR(view.quantidade)} ${view.unidadeMedida}`} />
          </div>

          <div className="rounded-lg bg-action-soft px-4 py-3">
            <span className="text-xs text-muted-foreground">Valor unitário registrado</span>
            <p className="text-2xl font-semibold text-action">{formatCurrencyBRL(view.valorUnitario)}</p>
          </div>
        </div>

        <Separator />

        <AtaPartnerSection detail={detail} />
      </DialogContent>
    </Dialog>
  )
}
