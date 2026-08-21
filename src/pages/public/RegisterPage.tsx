import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileStack } from 'lucide-react'
import { Seo } from '@/components/common'
import { RegisterForm } from '@/components/public'
import { ROUTES } from '@/constants/routes'

interface LocationState {
  from?: { pathname: string }
}

export function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()

  function handleSuccess() {
    const state = location.state as LocationState | null
    navigate(state?.from?.pathname ?? ROUTES.home, { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <Seo
        title="Criar conta"
        description="Crie sua conta na AquiAtas para visualizar os dados completos dos parceiros responsáveis pelas atas."
        path={ROUTES.cadastro}
      />

      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <FileStack className="size-8 text-brand" aria-hidden="true" />
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Crie sua conta</h1>
        <p className="text-sm text-muted-foreground">
          Cadastre-se para visualizar os dados completos dos parceiros responsáveis pelas atas.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <RegisterForm idPrefix="register" onSuccess={handleSuccess} />
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já possui uma conta?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand hover:underline">
          Entrar
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        <Link to={ROUTES.home} className="font-medium text-brand hover:underline">
          Voltar para a página inicial
        </Link>
      </p>
    </div>
  )
}
