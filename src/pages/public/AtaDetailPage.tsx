import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, Calendar, Lock, Mail, MessageCircle, Package, Phone, Tag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState, Seo } from '@/components/common'
import { LoginDialog, RegisterDialog } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { ataService } from '@/services/ataService'
import type { AtaDetail } from '@/types'
import { formatCurrencyBRL, formatDateBR, formatNumberBR } from '@/utils/format'
import { maskPhone } from '@/utils/masks'
import { ROUTES } from '@/constants/routes'

export function AtaDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isAuthenticated } = useAuth()
  const [ata, setAta] = useState<AtaDetail | null | undefined>(undefined)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Seo title={ata.descricao} description={`${ata.descricao} — ${ata.orgaoNome}`} path={ROUTES.ataDetalhe(ata.slug)} />

      <h1 className="text-2xl font-semibold text-foreground">{ata.descricao}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ata nº {ata.numeroAta} • {ata.orgaoNome}</p>

      <div className="mt-6 overflow-hidden rounded-xl">
        <img src={ata.imagemUrl} alt={ata.descricao} className="aspect-video w-full object-cover" />
      </div>

      <div className="mt-4">
        <StatusBadge situacao={ata.situacao} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailRow icon={Tag} label="Marca" value={ata.marcaNome} />
        <DetailRow icon={Package} label="Categoria" value={ata.categoriaNome} />
        <DetailRow icon={Package} label="Tipo de Ata" value={ata.tipoNome} />
        <DetailRow icon={Building2} label="Órgão" value={ata.orgaoNome} />
        <DetailRow icon={Calendar} label="Vigência" value={`${formatDateBR(ata.dataVigenciaInicio)} a ${formatDateBR(ata.dataVigenciaFim)}`} />
        <DetailRow icon={Package} label="Quantidade" value={`${formatNumberBR(ata.quantidade)} ${ata.unidadeMedida}`} />
      </div>

      <div className="mt-6 rounded-lg bg-muted/50 px-4 py-3">
        <span className="text-xs text-muted-foreground">Valor unitário</span>
        <p className="text-2xl font-semibold text-brand">{formatCurrencyBRL(ata.valorUnitario)}</p>
      </div>

      <Separator className="my-6" />

      {isAuthenticated && ata.partnerVisible ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Parceiro responsável</h2>
          <div className="flex items-center gap-3">
            <img src={ata.partnerLogoUrl} alt="" className="size-12 rounded-lg border border-border object-cover" />
            <div>
              <p className="text-sm font-medium text-foreground">{ata.partnerNome}</p>
              <p className="text-xs text-muted-foreground">{ata.partnerCidade} / {ata.partnerEstado}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={Building2} label="Parceiro" value={ata.partnerNome} />
            <DetailRow icon={User} label="Contato" value={ata.partnerContato} />
            <DetailRow icon={Phone} label="Telefone" value={maskPhone(ata.partnerTelefone)} />
            <DetailRow icon={MessageCircle} label="WhatsApp" value={maskPhone(ata.partnerWhatsapp)} />
            <DetailRow icon={Mail} label="Email" value={ata.partnerEmail} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-6 text-center">
          <Lock className="size-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Faça login para visualizar o parceiro responsável.</p>
          <div className="flex gap-2">
            <Button onClick={() => setLoginDialogOpen(true)}>Entrar</Button>
            <Button variant="outline" onClick={() => setRegisterDialogOpen(true)}>
              Criar conta
            </Button>
          </div>
        </div>
      )}

      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onSwitchToRegister={() => {
          setLoginDialogOpen(false)
          setRegisterDialogOpen(true)
        }}
      />
      <RegisterDialog
        open={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        onSwitchToLogin={() => {
          setRegisterDialogOpen(false)
          setLoginDialogOpen(true)
        }}
      />
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Tag; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  )
}
