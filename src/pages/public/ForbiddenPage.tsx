import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Seo } from '@/components/common'
import { ROUTES } from '@/constants/routes'

export function ForbiddenPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Seo title="Acesso restrito" description="Você não tem permissão para acessar esta página." path="/403" />
      <ShieldAlert className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-3xl font-semibold text-foreground">403</h1>
      <p className="text-sm text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      <Button asChild>
        <Link to={ROUTES.home}>Voltar para a página inicial</Link>
      </Button>
    </div>
  )
}
