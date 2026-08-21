import { useEffect, useRef, useState } from 'react'
import { Building2, Calendar, Lock, Mail, MessageCircle, Package, Phone, Tag, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LoginDialog } from './LoginDialog'
import { RegisterDialog } from './RegisterDialog'
import { useAuth } from '@/hooks/useAuth'
import { ataService } from '@/services/ataService'
import type { AtaDetail, AtaWithRelations } from '@/types'
import { formatCurrencyBRL, formatDateBR, formatNumberBR } from '@/utils/format'
import { maskPhone } from '@/utils/masks'

interface AtaDetailsModalProps {
  ata: AtaWithRelations | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function AtaDetailsModal({ ata, open, onOpenChange }: AtaDetailsModalProps) {
  const { isAuthenticated } = useAuth()
  const [detail, setDetail] = useState<AtaDetail | null>(null)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="pr-6 text-left text-lg">{view.descricao}</DialogTitle>
            <DialogDescription className="text-left">
              Ata nº {view.numeroAta || '—'} • {view.orgaoNome}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-hidden rounded-lg">
            <img src={view.imagemUrl} alt={view.descricao} className="aspect-video w-full object-cover" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge situacao={view.situacao} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={Tag} label="Marca" value={view.marcaNome} />
            <DetailRow icon={Package} label="Categoria" value={view.categoriaNome} />
            <DetailRow icon={Package} label="Tipo de Ata" value={view.tipoNome} />
            <DetailRow icon={Building2} label="Órgão" value={view.orgaoNome} />
            <DetailRow icon={Calendar} label="Vigência" value={`${formatDateBR(view.dataVigenciaInicio)} a ${formatDateBR(view.dataVigenciaFim)}`} />
            <DetailRow icon={Package} label="Quantidade" value={`${formatNumberBR(view.quantidade)} ${view.unidadeMedida}`} />
          </div>

          <div className="rounded-lg bg-primary-light px-4 py-3">
            <span className="text-xs text-muted-foreground">Valor unitário</span>
            <p className="text-2xl font-semibold text-brand">{formatCurrencyBRL(view.valorUnitario)}</p>
          </div>

          <Separator />

          {isAuthenticated && detail?.partnerVisible ? (
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-foreground">Parceiro responsável</h4>
              <div className="flex items-center gap-3">
                <img src={detail.partnerLogoUrl} alt="" className="size-12 rounded-lg border border-border object-cover" />
                <div>
                  <p className="text-sm font-medium text-foreground">{detail.partnerNome}</p>
                  <p className="text-xs text-muted-foreground">{detail.partnerCidade} / {detail.partnerEstado}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailRow icon={Building2} label="Parceiro" value={detail.partnerNome} />
                <DetailRow icon={User} label="Contato" value={detail.partnerContato} />
                <DetailRow icon={Phone} label="Telefone" value={maskPhone(detail.partnerTelefone)} />
                <DetailRow icon={MessageCircle} label="WhatsApp" value={maskPhone(detail.partnerWhatsapp)} />
                <DetailRow icon={Mail} label="Email" value={detail.partnerEmail} />
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
        </DialogContent>
      </Dialog>

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
    </>
  )
}
