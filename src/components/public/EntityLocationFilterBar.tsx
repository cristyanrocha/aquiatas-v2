import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EntityLocationFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  estado: string
  onEstadoChange: (value: string) => void
  estados: string[]
  cidade: string
  onCidadeChange: (value: string) => void
  cidades: string[]
}

/** Shared search + estado/cidade cascading filter bar for Parceiros and Órgãos Públicos. */
export function EntityLocationFilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  estado,
  onEstadoChange,
  estados,
  cidade,
  onCidadeChange,
  cidades,
}: EntityLocationFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="border-transparent bg-muted/50 pl-11"
        />
      </div>
      <Select value={estado} onValueChange={onEstadoChange}>
        <SelectTrigger aria-label="Filtrar por estado" className="w-full sm:w-48">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os estados</SelectItem>
          {estados.map((uf) => (
            <SelectItem key={uf} value={uf}>
              {uf}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={cidade} onValueChange={onCidadeChange}>
        <SelectTrigger aria-label="Filtrar por cidade" className="w-full sm:w-48">
          <SelectValue placeholder="Cidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas as cidades</SelectItem>
          {cidades.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
