import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AtaSortOption } from '@/types'

const SORT_OPTIONS: { value: AtaSortOption; label: string }[] = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'validade', label: 'Validade' },
  { value: 'menor_valor', label: 'Menor valor' },
  { value: 'maior_valor', label: 'Maior valor' },
  { value: 'alfabetica', label: 'Ordem alfabética' },
]

interface SortSelectProps {
  value: AtaSortOption
  onChange: (value: AtaSortOption) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as AtaSortOption)}>
      <SelectTrigger aria-label="Ordenar atas" className="w-full sm:w-56">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
