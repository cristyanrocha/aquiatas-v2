import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  placeholder?: string
  size?: 'default' | 'lg'
  className?: string
  buttonVariant?: 'default' | 'secondary'
}

export const SEARCH_BAR_INPUT_ID = 'search-bar-input'

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Busque por produto, descrição ou marca',
  size = 'default',
  className,
  buttonVariant = 'default',
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.()
      }}
      className={cn(
        'flex w-full items-center gap-2 rounded-full transition-all duration-200',
        size === 'lg' && 'focus-within:shadow-lg focus-within:ring-2 focus-within:ring-action/30 focus-within:ring-offset-2',
        className,
      )}
    >
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={SEARCH_BAR_INPUT_ID}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Buscar atas"
          className={cn(
            'border-transparent bg-white pl-11 text-foreground shadow-sm transition-shadow duration-200',
            size === 'lg' && 'h-14 rounded-full text-base focus-visible:ring-0',
          )}
        />
      </div>
      <Button
        type="submit"
        variant={buttonVariant}
        size={size === 'lg' ? 'lg' : 'default'}
        className={cn(size === 'lg' && 'h-14 shrink-0 rounded-full px-7 text-base')}
      >
        Buscar Atas
      </Button>
    </form>
  )
}
