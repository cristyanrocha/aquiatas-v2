import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Seo } from '@/components/common'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <Seo title="Página não encontrada" description="A página que você procura não existe ou foi movida." path="/404" />
      <FileQuestion className="size-12 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-3xl font-semibold text-foreground">404</h1>
      <p className="text-sm text-muted-foreground">A página que você procura não existe ou foi movida.</p>
      <Button asChild>
        <Link to={ROUTES.home}>Voltar para a página inicial</Link>
      </Button>
    </div>
  )
}
