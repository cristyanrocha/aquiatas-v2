import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, Seo, toast } from '@/components/common'
import { PasswordInput } from '@/components/forms'
import { AuthPageShell } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { isValidEmail } from '@/utils/validation'

interface LocationState {
  from?: { pathname: string }
}

export function LoginPage() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const busy = isSubmitting || isLoading

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return // evita envio duplicado

    const nextErrors: { email?: string; password?: string } = {}
    if (!isValidEmail(email)) nextErrors.email = 'Informe um email válido.'
    if (!password.trim()) nextErrors.password = 'Informe uma senha.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await login(email, password)
      const state = location.state as LocationState | null
      navigate(state?.from?.pathname ?? ROUTES.home, { replace: true })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível entrar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
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
          <Button type="submit" disabled={busy} className="mt-1">
            {busy ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </AuthPageShell>
    </>
  )
}
