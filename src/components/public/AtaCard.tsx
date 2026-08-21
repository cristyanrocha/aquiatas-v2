import { useState } from 'react'
import { Building2, Calendar, ImageOff, Store } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/common/StatusBadge'
import type { AtaWithRelations } from '@/types'
import { formatCurrencyBRL, formatDateBR, formatNumberBR } from '@/utils/format'

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
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <StatusBadge situacao={ata.situacao} className="absolute left-3 top-3 bg-card shadow-sm" />
      </div>

      <CardContent className="flex flex-col gap-3 px-5 pt-4">
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{ata.descricao}</h3>
          <div className="flex items-center gap-1.5 truncate text-sm font-medium text-foreground/80">
            <Building2 className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate">{ata.orgaoNome}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {ata.marcaNome}
          </Badge>
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {ata.categoriaNome}
          </Badge>
          <Badge variant="outline" className="font-normal text-muted-foreground">
            {ata.tipoNome}
          </Badge>
        </div>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 truncate">
            <Store className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{ata.partnerNome}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
            Validade: {formatDateBR(ata.dataVigenciaFim)}
          </span>
        </div>

        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">Qtd: {formatNumberBR(ata.quantidade)} {ata.unidadeMedida}</span>
          <span className="text-lg font-semibold text-brand">{formatCurrencyBRL(ata.valorUnitario)}</span>
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5">
        <Button
          variant="outline"
          className="w-full"
          onClick={(event) => {
            event.stopPropagation()
            onOpenDetails(ata)
          }}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}
