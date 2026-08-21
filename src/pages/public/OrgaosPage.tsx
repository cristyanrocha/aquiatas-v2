import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState, Seo } from '@/components/common'
import { useEntityStore } from '@/hooks/useEntityStore'
import { useDebounce } from '@/hooks/useDebounce'
import { publicAgencyStore } from '@/services/agencyService'
import { textIncludes } from '@/utils/text'

export function OrgaosPage() {
  const { data: agencies } = useEntityStore(publicAgencyStore)
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('todos')
  const [cidade, setCidade] = useState('todas')
  const debouncedSearch = useDebounce(search, 300)

  const estados = useMemo(() => Array.from(new Set(agencies.map((a) => a.estado))).sort(), [agencies])
  const cidades = useMemo(() => {
    const source = estado === 'todos' ? agencies : agencies.filter((a) => a.estado === estado)
    return Array.from(new Set(source.map((a) => a.cidade))).sort()
  }, [agencies, estado])

  const filtered = agencies.filter((agency) => {
    if (estado !== 'todos' && agency.estado !== estado) return false
    if (cidade !== 'todas' && agency.cidade !== cidade) return false
    if (debouncedSearch && !textIncludes(agency.nome, debouncedSearch)) return false
    return true
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Seo
        title="Órgãos Públicos"
        description="Conheça os órgãos públicos que divulgam Atas de Registro de Preços na AquiAtas."
        path="/orgaos"
      />
      <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Órgãos Públicos</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">Órgãos que utilizam a plataforma para divulgar suas atas.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar órgão"
            aria-label="Buscar órgão"
            className="pl-11"
          />
        </div>
        <Select
          value={estado}
          onValueChange={(value) => {
            setEstado(value)
            setCidade('todas')
          }}
        >
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
        <Select value={cidade} onValueChange={setCidade}>
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

      <div className="mt-8">
        {filtered.length === 0 ? (
          <EmptyState title="Nenhum órgão encontrado" description="Ajuste os filtros para ver mais resultados." />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((agency) => (
              <div
                key={agency.id}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex size-24 items-center justify-center rounded-xl border border-border bg-white p-3 shadow-sm sm:size-[108px] lg:size-[120px]">
                  <img src={agency.logoUrl} alt={agency.nome} className="size-full object-contain" />
                </div>
                <span className="text-sm font-semibold text-foreground">{agency.nome}</span>
                {agency.cidade && agency.estado && (
                  <span className="text-xs text-muted-foreground">
                    {agency.cidade}/{agency.estado}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
