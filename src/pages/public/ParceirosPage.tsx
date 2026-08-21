import { useMemo, useState } from 'react'
import { EmptyState, Seo } from '@/components/common'
import { EntityLocationFilterBar, EntityLogoCard } from '@/components/public'
import { useEntityStore } from '@/hooks/useEntityStore'
import { useDebounce } from '@/hooks/useDebounce'
import { publicPartnerStore } from '@/services/partnerService'
import { textIncludes } from '@/utils/text'

export function ParceirosPage() {
  const { data: partners } = useEntityStore(publicPartnerStore)
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('todos')
  const [cidade, setCidade] = useState('todas')
  const debouncedSearch = useDebounce(search, 300)

  const estados = useMemo(() => Array.from(new Set(partners.map((p) => p.estado))).sort(), [partners])
  const cidades = useMemo(() => {
    const source = estado === 'todos' ? partners : partners.filter((p) => p.estado === estado)
    return Array.from(new Set(source.map((p) => p.cidade))).sort()
  }, [partners, estado])

  const filtered = partners.filter((partner) => {
    if (estado !== 'todos' && partner.estado !== estado) return false
    if (cidade !== 'todas' && partner.cidade !== cidade) return false
    if (debouncedSearch && !textIncludes(partner.nomeFantasia, debouncedSearch)) return false
    return true
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Seo
        title="Parceiros"
        description="Conheça as empresas parceiras que fornecem produtos e serviços através de Atas de Registro de Preços."
        path="/parceiros"
      />
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Parceiros</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Empresas fornecedoras que divulgam suas Atas de Registro de Preços na plataforma.
        </p>
      </div>

      <div className="mt-6">
        <EntityLocationFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar parceiro"
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

      <div className="mt-4 text-xs text-muted-foreground">{filtered.length} parceiro(s) encontrado(s)</div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState title="Nenhum parceiro encontrado" description="Ajuste os filtros para ver mais resultados." />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((partner) => (
              <EntityLogoCard
                key={partner.id}
                logoUrl={partner.logoUrl}
                name={partner.nomeFantasia}
                location={`${partner.cidade} / ${partner.estado}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
