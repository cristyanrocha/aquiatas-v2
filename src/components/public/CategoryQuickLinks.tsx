import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryQuickLinksProps {
  categories: Category[]
  activeCategoryIds: string[]
  onToggle: (categoryId: string) => void
  className?: string
}

/** Horizontal quick-access category pills below the hero search, for one-tap browsing. */
export function CategoryQuickLinks({ categories, activeCategoryIds, onToggle, className }: CategoryQuickLinksProps) {
  if (categories.length === 0) return null

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="mx-auto flex w-max min-w-full items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
        {categories.map((category) => {
          const active = activeCategoryIds.includes(category.id)
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggle(category.id)}
              aria-pressed={active}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                active
                  ? 'border-transparent bg-brand text-primary-foreground'
                  : 'border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground/85 hover:bg-primary-foreground/10',
              )}
            >
              {category.nome}
            </button>
          )
        })}
      </div>
    </div>
  )
}
