import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileStack } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, Seo, toast } from '@/components/common'
import { PasswordInput } from '@/components/forms'
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
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Seo title="Entrar" description="Acesse sua conta AquiAtas para visualizar dados completos dos parceiros." path={ROUTES.login} />

      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <FileStack className="size-8 text-brand" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Entrar na AquiAtas</h1>
        <p className="text-sm text-muted-foreground">Acesse para visualizar os parceiros responsáveis pelas atas.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
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

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Ainda não possui uma conta?{' '}
        <Link to={ROUTES.cadastro} state={location.state} className="font-medium text-brand hover:underline">
          Criar conta
        </Link>
      </p>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Voltar para a{' '}
        <Link to={ROUTES.home} className="font-medium text-brand hover:underline">
          página inicial
        </Link>
      </p>
    </div>
  )
}
