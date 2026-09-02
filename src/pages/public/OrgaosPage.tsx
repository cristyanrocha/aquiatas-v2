import { useMemo, useState } from 'react'
import { EmptyState, Seo } from '@/components/common'
import { EntityLocationFilterBar, EntityLogoCard } from '@/components/public'
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Seo
        title="Órgãos Públicos"
        description="Conheça os órgãos públicos que divulgam Atas de Registro de Preços na AquiAtas."
        path="/orgaos"
      />
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Órgãos Públicos</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">Órgãos que utilizam a plataforma para divulgar suas atas.</p>
      </div>

      <div className="mt-6">
        <EntityLocationFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar órgão"
          estado={estado}
          onEstadoChange={(value) => {
            setEstado(value)
            setCidade('todas')
          }}
          estados={estados}
          cidade={cidade}
          onCidadeChange={setCidade}
          cidades={cidades}
        />
      </div>

      <div className="mt-4 text-xs text-muted-foreground">{filtered.length} órgão(s) encontrado(s)</div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState title="Nenhum órgão encontrado" description="Ajuste os filtros para ver mais resultados." />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((agency) => (
              <EntityLogoCard
                key={agency.id}
                logoUrl={agency.logoUrl}
                name={agency.nome}
                location={agency.cidade && agency.estado ? `${agency.cidade}/${agency.estado}` : undefined}
                badge={
                  <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    {agency.esfera}
                  </span>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
