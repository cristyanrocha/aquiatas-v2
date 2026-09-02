import { useState } from 'react'
import { ArrowRight, Building2, ImageOff, Store } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { AtaWithRelations } from '@/types'
import { formatCurrencyBRL, formatDateBR } from '@/utils/format'

interface AtaCardProps {
  ata: AtaWithRelations
  onOpenDetails: (ata: AtaWithRelations) => void
}

export function AtaCard({ ata, onOpenDetails }: AtaCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(ata)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpenDetails(ata)
        }
      }}
      aria-label={`Ver detalhes: ${ata.descricao}`}
      className="group cursor-pointer overflow-hidden py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {imageError ? (
          <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
            <ImageOff className="size-8" aria-hidden="true" />
            <span className="text-xs">Imagem indisponível</span>
          </div>
        ) : (
          <img
            src={ata.imagemUrl}
            alt={ata.descricao}
            loading="lazy"
            onError={() => setImageError(true)}
            className="size-full object-cover"
          />
        )}
        <StatusBadge situacao={ata.situacao} className="absolute left-3 top-3 bg-card shadow-sm" />
      </div>

      <CardContent className="flex flex-col gap-3 px-5 pt-4">
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{ata.descricao}</h3>
          <p className="truncate text-sm font-medium text-action">{ata.marcaNome}</p>
        </div>

        <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 truncate">
            <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{ata.orgaoNome}</span>
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <Store className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{ata.partnerNome}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Validade</span>
            <span className="text-sm font-semibold text-foreground">{formatDateBR(ata.dataVigenciaFim)}</span>
          </div>
          <div className="flex flex-col gap-0.5 text-right">
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">Valor unitário</span>
            <span className="text-lg font-semibold text-action">{formatCurrencyBRL(ata.valorUnitario)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5">
        <Button
          variant="ghost"
          className="w-full justify-between text-foreground hover:bg-muted"
          onClick={(event) => {
            event.stopPropagation()
            onOpenDetails(ata)
          }}
        >
          Ver detalhes
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  )
}
