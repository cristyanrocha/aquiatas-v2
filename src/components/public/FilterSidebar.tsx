import { Fragment } from 'react'
import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { AtaFilters, AtaType, Brand, Category } from '@/types'
import { EMPTY_ATA_FILTERS } from '@/services/ataService'

interface FilterSidebarProps {
  filters: AtaFilters
  onFiltersChange: (filters: AtaFilters) => void
  categories: Category[]
  brands: Brand[]
  ataTypes: AtaType[]
  resultCount: number
  className?: string
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

/** Alphabetical, accent- and case-aware pt-BR sort for filter option labels. Display order only — never touches ids. */
function byLabel(a: { label: string }, b: { label: string }): number {
  return a.label.localeCompare(b.label, 'pt-BR')
}

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
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="flex max-h-56 flex-col gap-2 overflow-y-auto pr-1 sm:max-h-64 lg:max-h-72">
        {options.map((option) => {
          const checkboxId = `filter-${title}-${option.id}`
          return (
            <div key={option.id} className="flex items-center gap-2">
              <Checkbox
                id={checkboxId}
                checked={selected.includes(option.id)}
                onCheckedChange={() => onToggle(option.id)}
              />
              <Label htmlFor={checkboxId} className="cursor-pointer text-sm font-normal text-muted-foreground">
                {option.label}
              </Label>
            </div>
          )
        })}
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
  resultCount,
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
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Filtros</h2>
        {hasActiveFilters && (
          <span className="text-xs text-muted-foreground">{resultCount} resultado(s)</span>
        )}
      </div>

      {hasActiveFilters && (
        <Fragment>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.onRemove}
                className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-primary-light px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
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
