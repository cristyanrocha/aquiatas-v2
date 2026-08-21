import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminFormHeaderProps {
  title: string
  backHref: string
}

export function AdminFormHeader({ title, backHref }: AdminFormHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button asChild variant="ghost" size="icon">
        <Link to={backHref} aria-label="Voltar">
          <ArrowLeft className="size-4" />
        </Link>
      </Button>
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
    </div>
  )
}
