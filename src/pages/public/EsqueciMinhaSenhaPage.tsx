import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, MailCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, Seo } from '@/components/common'
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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Seo title="Esqueci minha senha" description="Recupere o acesso à sua conta AquiAtas." path={ROUTES.esqueciMinhaSenha} />

      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <FileStack className="size-8 text-brand" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Esqueci minha senha</h1>
        <p className="text-sm text-muted-foreground">Informe seu email para receber um link de redefinição de senha.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
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
            <Button type="submit" disabled={isSubmitting} className="mt-1">
              {isSubmitting ? 'Enviando...' : 'Enviar link de redefinição'}
            </Button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to={ROUTES.login} className="font-medium text-brand hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
