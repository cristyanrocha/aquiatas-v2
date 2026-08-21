import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RegisterForm } from './RegisterForm'

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin?: () => void
}

/** Registration as a dialog so it can sit on top of whatever the visitor was looking at (e.g. an ata's details) instead of navigating away and losing that context. */
export function RegisterDialog({ open, onOpenChange, onSwitchToLogin }: RegisterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crie sua conta</DialogTitle>
          <DialogDescription>Cadastre-se para visualizar o parceiro responsável por esta ata.</DialogDescription>
        </DialogHeader>

        <RegisterForm idPrefix="register-dialog" onSuccess={() => onOpenChange(false)} />

        {onSwitchToLogin && (
          <p className="text-center text-sm text-muted-foreground">
            Já possui uma conta?{' '}
            <button type="button" onClick={onSwitchToLogin} className="font-medium text-brand hover:underline">
              Entrar
            </button>
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
