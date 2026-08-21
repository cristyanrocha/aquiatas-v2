import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  AtaCard,
  AtaDetailsModal,
  FilterSidebar,
  HeroBackground,
  NewsletterSection,
  SearchBar,
  SortSelect,
} from '@/components/public'
import { AtaGridSkeleton, EmptyState, Seo } from '@/components/common'
import { AppPagination } from '@/components/common/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import { useEntityStore } from '@/hooks/useEntityStore'
import { categoryStore } from '@/services/categoryService'
import { ataTypeStore } from '@/services/ataTypeService'
import { brandStore } from '@/services/brandService'
import { ataService, EMPTY_ATA_FILTERS } from '@/services/ataService'
import type { AtaFilters, AtaSortOption, AtaWithRelations, PaginatedResult } from '@/types'

const PAGE_SIZE = 9

const EMPTY_RESULT: PaginatedResult<AtaWithRelations> = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 1,
}

export function HomePage() {
  const [searchParams] = useSearchParams()
  const { data: categories } = useEntityStore(categoryStore)
  const { data: ataTypes } = useEntityStore(ataTypeStore)
  const { data: brands } = useEntityStore(brandStore)

  const [filters, setFilters] = useState<AtaFilters>({
    ...EMPTY_ATA_FILTERS,
    search: searchParams.get('busca') ?? '',
  })
  const [sort, setSort] = useState<AtaSortOption>('recentes')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<PaginatedResult<AtaWithRelations>>(EMPTY_RESULT)
  const [isLoading, setIsLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selectedAta, setSelectedAta] = useState<AtaWithRelations | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(filters.search, 300)
  const effectiveFilters = useMemo(() => ({ ...filters, search: debouncedSearch }), [filters, debouncedSearch])

  useEffect(() => {
    setPage(1)
  }, [effectiveFilters, sort])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    ataService
      .search(effectiveFilters, sort, { page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [effectiveFilters, sort, page])

  function handleOpenDetails(ata: AtaWithRelations) {
    setSelectedAta(ata)
    setModalOpen(true)
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const activeFilterCount = filters.categoriaIds.length + filters.marcaIds.length + filters.tipoIds.length

  return (
    <div className="flex flex-col">
      <Seo
        title="A maior vitrine digital de Atas de Registro de Preços do Brasil"
        description="Encontre produtos, fornecedores e oportunidades disponíveis em Atas vigentes de forma simples, rápida e transparente."
      />

      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground sm:py-32 lg:py-36">
        <HeroBackground />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center sm:px-6">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl lg:tracking-tighter">
            Encontre Atas de Registro de Preços de forma simples.
          </h1>
          <p className="max-w-2xl text-base text-primary-foreground/80 sm:text-lg lg:text-xl">
            Pesquise produtos, fornecedores, órgãos e oportunidades em Atas de Registro de Preços vigentes.
          </p>
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters((prev) => ({ ...prev, search: value }))}
            size="lg"
            buttonVariant="secondary"
            className="mt-2 w-full max-w-2xl"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 pb-20 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[272px_1fr]">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            brands={brands}
            ataTypes={ataTypes}
            resultCount={result.total}
            className="hidden self-start rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:block"
          />

          <div ref={resultsRef} className="flex scroll-mt-24 flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="size-4" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-brand text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? 'Buscando...' : `${result.total} ata(s) encontrada(s)`}
                </span>
              </div>
              <SortSelect value={sort} onChange={setSort} />
            </div>

            {isLoading ? (
              <AtaGridSkeleton count={6} />
            ) : result.items.length === 0 ? (
              <EmptyState
                title="Nenhuma ata encontrada"
                description="Tente ajustar os filtros ou buscar por outro termo."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((ata) => (
                  <AtaCard key={ata.id} ata={ata} onOpenDetails={handleOpenDetails} />
                ))}
              </div>
            )}

            {result.totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                <AppPagination page={page} totalPages={result.totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      </section>

      <NewsletterSection />

      <AtaDetailsModal ata={selectedAta} open={modalOpen} onOpenChange={setModalOpen} />

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="right" className="flex w-full max-w-sm flex-col">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              categories={categories}
              brands={brands}
              ataTypes={ataTypes}
              resultCount={result.total}
            />
          </div>
          <div className="border-t border-border p-4">
            <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>
              Ver {result.total} resultado(s)
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
