import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, Seo, toast } from '@/components/common'
import { PasswordInput } from '@/components/forms'
import { AuthPageShell } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { isValidEmail } from '@/utils/validation'
import { EMAIL_NOT_CONFIRMED_MESSAGE } from '@/lib/supabaseErrors'

const RESEND_COOLDOWN_SECONDS = 30

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { login, isLoading, resendConfirmationEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const busy = isSubmitting || isLoading

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return // evita envio duplicado

    const nextErrors: { email?: string; password?: string } = {}
    if (!isValidEmail(email)) nextErrors.email = 'Informe um email válido.'
    if (!password.trim()) nextErrors.password = 'Informe uma senha.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setUnconfirmedEmail(null)
    try {
      await login(email, password)
      const state = location.state as LocationState | null
      navigate(state?.from?.pathname ?? ROUTES.home, { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.'
      if (message === EMAIL_NOT_CONFIRMED_MESSAGE) {
        setUnconfirmedEmail(email.trim().toLowerCase())
      } else {
        toast.error(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    if (!unconfirmedEmail || isResending || resendCooldown > 0) return
    setIsResending(true)
    try {
      await resendConfirmationEmail(unconfirmedEmail)
      toast.success('E-mail de confirmação reenviado. Verifique sua caixa de entrada.')
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível reenviar o e-mail. Tente novamente.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <>
      <Seo title="Entrar" description="Acesse sua conta AquiAtas para visualizar dados completos dos parceiros." path={ROUTES.login} />
      <AuthPageShell
        title="Entrar na AquiAtas"
        description="Acesse para visualizar os parceiros responsáveis pelas atas."
        showIcon={false}
        footer={
          <>
            <p>
              Ainda não possui uma conta?{' '}
              <Link to={ROUTES.cadastro} state={location.state} className="font-medium text-brand hover:underline">
                Criar conta
              </Link>
            </p>
            <Link to={ROUTES.home} className="font-medium text-brand hover:underline">
              Voltar para a página inicial
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormField label="Email" error={errors.email} required>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" autoFocus />
          </FormField>
          <FormField label="Senha" error={errors.password} required>
            <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </FormField>
          <div className="-mt-2 text-right">
            <Link to={ROUTES.esqueciMinhaSenha} className="text-xs font-medium text-brand hover:underline">
              Esqueci minha senha
            </Link>
          </div>

          {unconfirmedEmail && (
            <div className="rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning-foreground">
              <p>{EMAIL_NOT_CONFIRMED_MESSAGE}</p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="mt-2 font-medium text-brand hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:no-underline"
              >
                {isResending
                  ? 'Reenviando...'
                  : resendCooldown > 0
                    ? `Reenviar e-mail de confirmação (${resendCooldown}s)`
                    : 'Reenviar e-mail de confirmação'}
              </button>
            </div>
          )}

          <Button type="submit" disabled={busy} className="mt-1">
            {busy ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </AuthPageShell>
    </>
  )
}
