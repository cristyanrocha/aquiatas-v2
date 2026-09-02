import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, Seo } from '@/components/common'
import { AuthPageShell } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { isValidEmail } from '@/utils/validation'

export function EsqueciMinhaSenhaPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    if (!isValidEmail(email)) {
      setError('Informe um email válido.')
      return
    }
    setError(undefined)
    setIsSubmitting(true)
    try {
      await resetPassword(email)
    } catch {
      // Intentionally ignored: we always show the same success message below,
      // so a stranger probing this form can't discover which emails exist.
    } finally {
      setIsSubmitting(false)
      setIsSent(true)
    }
  }

  return (
    <>
      <Seo title="Esqueci minha senha" description="Recupere o acesso à sua conta AquiAtas." path={ROUTES.esqueciMinhaSenha} />
      <AuthPageShell
        title="Esqueci minha senha"
        description="Informe seu email para receber um link de redefinição de senha."
        footer={
          <Link to={ROUTES.login} className="font-medium text-brand hover:underline">
            Voltar para o login
          </Link>
        }
      >
        {isSent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <MailCheck className="size-8 text-success" aria-hidden="true" />
            <p className="text-sm text-foreground">
              Se houver uma conta cadastrada com este email, enviamos um link para redefinir sua senha. Verifique sua caixa de
              entrada e o spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormField label="Email" error={error} required>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                autoFocus
              />
            </FormField>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 bg-action text-white hover:bg-action-hover active:bg-action-active"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar link de redefinição'}
            </Button>
          </form>
        )}
      </AuthPageShell>
    </>
  )
}
