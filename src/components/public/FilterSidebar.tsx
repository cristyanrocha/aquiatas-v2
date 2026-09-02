import { Fragment, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import type { AtaFilters, AtaType, Brand, Category } from '@/types'
import { EMPTY_ATA_FILTERS } from '@/services/ataService'
import { textIncludes } from '@/utils/text'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  filters: AtaFilters
  onFiltersChange: (filters: AtaFilters) => void
  categories: Category[]
  brands: Brand[]
  ataTypes: AtaType[]
  className?: string
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

/** Alphabetical, accent- and case-aware pt-BR sort for filter option labels. Display order only — never touches ids. */
function byLabel(a: { label: string }, b: { label: string }): number {
  return a.label.localeCompare(b.label, 'pt-BR')
}

const SEARCHABLE_THRESHOLD = 8

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: { id: string; label: string }[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const isSearchable = options.length > SEARCHABLE_THRESHOLD

  const visibleOptions = useMemo(() => {
    if (!isSearchable || !query.trim()) return options
    return options.filter((option) => textIncludes(option.label, query))
  }, [options, query, isSearchable])

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
        {selected.length > 0 && (
          <span className="rounded-full bg-action-soft px-2 py-0.5 text-[11px] font-medium text-action">
            {selected.length}
          </span>
        )}
      </div>

      {isSearchable && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar em ${title.toLowerCase()}...`}
            aria-label={`Buscar em ${title}`}
            className="h-8 pl-8 text-xs"
          />
        </div>
      )}

      <div className="flex max-h-64 flex-col gap-0.5 overflow-y-auto pr-1 sm:max-h-72">
        {visibleOptions.length === 0 ? (
          <p className="py-1.5 text-xs text-muted-foreground">Nenhuma opção encontrada.</p>
        ) : (
          visibleOptions.map((option) => {
            const checkboxId = `filter-${title}-${option.id}`
            const isSelected = selected.includes(option.id)
            return (
              <div
                key={option.id}
                className={cn(
                  'flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-muted/60',
                  isSelected && 'bg-action-soft/60',
                )}
              >
                <Checkbox
                  id={checkboxId}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(option.id)}
                />
                <Label
                  htmlFor={checkboxId}
                  className={cn(
                    'w-full cursor-pointer text-sm font-normal text-muted-foreground',
                    isSelected && 'font-medium text-foreground',
                  )}
                >
                  {option.label}
                </Label>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  categories,
  brands,
  ataTypes,
  className,
}: FilterSidebarProps) {
  const activeChips: { key: string; label: string; onRemove: () => void }[] = [
    ...filters.categoriaIds.map((id) => ({
      key: `cat-${id}`,
      label: categories.find((c) => c.id === id)?.nome ?? id,
      onRemove: () => onFiltersChange({ ...filters, categoriaIds: toggleValue(filters.categoriaIds, id) }),
    })),
    ...filters.marcaIds.map((id) => ({
      key: `marca-${id}`,
      label: brands.find((b) => b.id === id)?.nome ?? id,
      onRemove: () => onFiltersChange({ ...filters, marcaIds: toggleValue(filters.marcaIds, id) }),
    })),
    ...filters.tipoIds.map((id) => ({
      key: `tipo-${id}`,
      label: ataTypes.find((t) => t.id === id)?.nome ?? id,
      onRemove: () => onFiltersChange({ ...filters, tipoIds: toggleValue(filters.tipoIds, id) }),
    })),
  ]

  const hasActiveFilters = activeChips.length > 0 || filters.search.length > 0

  return (
    <aside className={className} aria-label="Filtros de busca">
      <div className="flex items-center">
        <h2 className="font-display text-base font-semibold text-foreground">Filtros</h2>
      </div>

      {hasActiveFilters && (
        <Fragment>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-action/15 bg-action-soft px-2.5 py-1 text-xs font-medium text-action transition-colors hover:bg-action/10"
              >
                {chip.label}
                <X className="size-3" aria-hidden="true" />
              </button>
            ))}
          </div>
          <Button
            variant="link"
            size="sm"
            className="mt-1 h-auto px-0 text-xs"
            onClick={() => onFiltersChange({ ...EMPTY_ATA_FILTERS })}
          >
            Limpar filtros
          </Button>
        </Fragment>
      )}

      <Separator className="my-4" />

      <div className="flex flex-col gap-5">
        <FilterGroup
          title="Categoria"
          options={categories.map((c) => ({ id: c.id, label: c.nome })).sort(byLabel)}
          selected={filters.categoriaIds}
          onToggle={(id) => onFiltersChange({ ...filters, categoriaIds: toggleValue(filters.categoriaIds, id) })}
        />
        <Separator />
        <FilterGroup
          title="Marca"
          options={brands.map((b) => ({ id: b.id, label: b.nome })).sort(byLabel)}
          selected={filters.marcaIds}
          onToggle={(id) => onFiltersChange({ ...filters, marcaIds: toggleValue(filters.marcaIds, id) })}
        />
        <Separator />
        <FilterGroup
          title="Tipo"
          options={ataTypes.map((t) => ({ id: t.id, label: t.nome })).sort(byLabel)}
          selected={filters.tipoIds}
          onToggle={(id) => onFiltersChange({ ...filters, tipoIds: toggleValue(filters.tipoIds, id) })}
        />
      </div>
    </aside>
  )
}
