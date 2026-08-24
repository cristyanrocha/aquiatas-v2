import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormField, toast } from '@/components/common'
import { PasswordInput } from '@/components/forms'
import { useAuth } from '@/hooks/useAuth'
import { isValidEmail } from '@/utils/validation'

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister?: () => void
}

/** Login as a dialog so it can sit on top of whatever the visitor was looking at (e.g. an ata's details) instead of navigating away and losing that context. */
export function LoginDialog({ open, onOpenChange, onSwitchToRegister }: LoginDialogProps) {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const busy = isSubmitting || isLoading

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return

    const nextErrors: { email?: string; password?: string } = {}
    if (!isValidEmail(email)) nextErrors.email = 'Informe um email válido.'
    if (!password.trim()) nextErrors.password = 'Informe uma senha.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await login(email, password)
      setEmail('')
      setPassword('')
      setErrors({})
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Entrar na AquiAtas</DialogTitle>
          <DialogDescription>Acesse para visualizar o parceiro responsável por esta ata.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormField label="Email" error={errors.email} required>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" autoFocus />
          </FormField>
          <FormField label="Senha" error={errors.password} required>
            <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </FormField>
          <Button type="submit" disabled={busy} className="bg-[#2A76E2] text-white hover:bg-[#2568C7] active:bg-[#225EB5]">
            {busy ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {onSwitchToRegister && (
          <p className="text-center text-sm text-muted-foreground">
            Ainda não possui uma conta?{' '}
            <button type="button" onClick={onSwitchToRegister} className="font-medium text-brand hover:underline">
              Criar conta
            </button>
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
