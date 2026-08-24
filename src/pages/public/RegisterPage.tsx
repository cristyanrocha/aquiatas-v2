import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Seo } from '@/components/common'
import { RegisterForm, AuthPageShell } from '@/components/public'
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
    <>
      <Seo
        title="Criar conta"
        description="Crie sua conta na AquiAtas para visualizar os dados completos dos parceiros responsáveis pelas atas."
        path={ROUTES.cadastro}
      />
      <AuthPageShell
        title="Crie sua conta"
        description="Cadastre-se para visualizar os dados completos dos parceiros responsáveis pelas atas."
        showIcon={false}
        footer={
          <>
            <p>
              Já possui uma conta?{' '}
              <Link to={ROUTES.login} className="font-medium text-brand hover:underline">
                Entrar
              </Link>
            </p>
            <Link to={ROUTES.home} className="font-medium text-brand hover:underline">
              Voltar para a página inicial
            </Link>
          </>
        }
      >
        <RegisterForm idPrefix="register" onSuccess={handleSuccess} />
      </AuthPageShell>
    </>
  )
}
