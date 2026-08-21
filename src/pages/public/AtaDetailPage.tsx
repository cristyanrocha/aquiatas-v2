import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, Calendar, FileText, Package, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge, DetailRow, EmptyState, Seo } from '@/components/common'
import { AtaPartnerSection } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { ataService } from '@/services/ataService'
import type { AtaDetail } from '@/types'
import { formatCurrencyBRL, formatDateBR, formatNumberBR } from '@/utils/format'
import { ROUTES } from '@/constants/routes'

export function AtaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuth()
  const [ata, setAta] = useState<AtaDetail | null | undefined>(undefined)
  const viewedAtaIdRef = useRef<string | null>(null)

  // Re-fetches on auth change (login/logout) so the partner section (server-gated by
  // is_active_user()) updates in place, without requiring a page reload.
  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ataService.getBySlugWithRelations(slug).then((found) => {
      if (cancelled) return
      setAta(found ?? null)
      if (found && viewedAtaIdRef.current !== found.id) {
        viewedAtaIdRef.current = found.id
        void ataService.incrementView(found.id)
      }
    })
    return () => {
      cancelled = true
    }
  }, [slug, isAuthenticated])

  if (ata === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-muted-foreground">Carregando...</div>
  }

  if (ata === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Ata não encontrada"
          description="Verifique o link ou volte para a página inicial."
          action={
            <Button asChild>
              <Link to={ROUTES.home}>Voltar para a Home</Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <Seo title={ata.descricao} description={`${ata.descricao} — ${ata.orgaoNome}`} path={ROUTES.ataDetalhe(ata.slug)} />

      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{ata.descricao}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Pregão {ata.numeroAta || '—'} • {ata.orgaoNome}</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border">
        <img src={ata.imagemUrl} alt={ata.descricao} className="aspect-video w-full object-cover" />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Identificação
          </h2>
          <StatusBadge situacao={ata.situacao} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailRow icon={Tag} label="Marca" value={ata.marcaNome} />
          <DetailRow icon={Package} label="Categoria" value={ata.categoriaNome} />
        </div>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Informações da Ata
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DetailRow icon={FileText} label="Pregão" value={ata.numeroAta || '—'} />
          <DetailRow icon={Building2} label="Órgão" value={ata.orgaoNome} />
          <DetailRow icon={Package} label="Tipo de Ata" value={ata.tipoNome} />
          <DetailRow icon={Calendar} label="Vigência" value={`${formatDateBR(ata.dataVigenciaInicio)} a ${formatDateBR(ata.dataVigenciaFim)}`} />
          <DetailRow icon={Package} label="Quantidade registrada" value={`${formatNumberBR(ata.quantidade)} ${ata.unidadeMedida}`} />
        </div>

        <div className="rounded-lg bg-primary-light px-4 py-3">
          <span className="text-xs text-muted-foreground">Valor unitário registrado</span>
          <p className="text-2xl font-semibold text-brand">{formatCurrencyBRL(ata.valorUnitario)}</p>
        </div>
      </div>

      <Separator className="my-8" />

      <AtaPartnerSection detail={ata} />
    </div>
  )
}
