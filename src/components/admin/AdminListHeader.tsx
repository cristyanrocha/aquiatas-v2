import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface AdminListHeaderProps {
  title: string
  description?: string
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  newHref: string
  newLabel: string
}

export function AdminListHeader({
  title,
  description,
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  newHref,
  newLabel,
}: AdminListHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button asChild>
          <Link to={newHref}>
            <Plus className="size-4" />
            {newLabel}
          </Link>
        </Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="pl-11"
        />
      </div>
    </div>
  )
}
