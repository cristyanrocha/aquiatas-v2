import { useState } from 'react'
import { Building2, Lock, Mail, MessageCircle, Phone, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DetailRow } from '@/components/common/DetailRow'
import { LoginDialog } from './LoginDialog'
import { RegisterDialog } from './RegisterDialog'
import { useAuth } from '@/hooks/useAuth'
import type { AtaDetail } from '@/types'
import { maskPhone } from '@/utils/masks'

interface AtaPartnerSectionProps {
  detail: AtaDetail | null
}

/**
 * Shared "Empresa / Parceiro" block for the Ata detail modal and detail page.
 * `partnerVisible` is decided server-side (RLS / is_active_user()) — this component only
 * reflects that flag, it never gates access itself.
 */
export function AtaPartnerSection({ detail }: AtaPartnerSectionProps) {
  const { isAuthenticated } = useAuth()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)

  const canView = isAuthenticated && detail?.partnerVisible

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        Empresa / Parceiro
      </h2>

      {canView && detail ? (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <img src={detail.partnerLogoUrl} alt="" className="size-12 shrink-0 rounded-lg border border-border object-cover" />
            <div>
              <p className="text-sm font-semibold text-foreground">{detail.partnerNome}</p>
              <p className="text-xs text-muted-foreground">{detail.partnerCidade} / {detail.partnerEstado}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailRow icon={User} label="Contato" value={detail.partnerContato} />
            <DetailRow icon={Phone} label="Telefone" value={maskPhone(detail.partnerTelefone)} />
            <DetailRow icon={MessageCircle} label="WhatsApp" value={maskPhone(detail.partnerWhatsapp)} />
            <DetailRow icon={Mail} label="Email" value={detail.partnerEmail} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary-light text-brand">
            <Lock className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Dados do parceiro protegidos</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Faça login para visualizar o contato da empresa responsável por esta Ata.
            </p>
          </div>
          <div className="mt-1 flex gap-2">
            <Button
              onClick={() => setLoginDialogOpen(true)}
              className="bg-[#2A76E2] text-white hover:bg-[#2568C7] active:bg-[#225EB5]"
            >
              <Building2 />
              Entrar
            </Button>
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
