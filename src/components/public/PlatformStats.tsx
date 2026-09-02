import { useEffect, useState } from 'react'
import { statsService, type PublicStats } from '@/services/statsService'

interface PlatformStatsProps {
  /** Already loaded by the Home page for the filter sidebar — reused here for zero extra queries. */
  marcas: number
}

interface StatItem {
  label: string
  value: number | null
}

export function PlatformStats({ marcas }: PlatformStatsProps) {
  const [stats, setStats] = useState<PublicStats | null>(null)

  useEffect(() => {
    let cancelled = false
    statsService
      .getPublicStats()
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch(() => {
        /** Decorative section — a failed fetch just leaves the numbers blank, never blocks the page. */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const items: StatItem[] = [
    { label: 'Atas de Registro de Preços', value: stats?.atas ?? null },
    { label: 'Órgãos Públicos', value: stats?.orgaos ?? null },
    { label: 'Marcas Disponíveis', value: marcas },
    { label: 'Estados Atendidos', value: stats?.estados ?? null },
  ]

  return (
    <section className="border-y border-border bg-muted/40 py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">AquiAtas em números</p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:divide-x sm:divide-border">
          {items.map((item, index) => (
            <div key={item.label} className={index > 0 ? 'flex flex-col gap-1 sm:pl-6' : 'flex flex-col gap-1'}>
              {item.value === null ? (
                <div className="h-9 w-16 animate-pulse rounded bg-muted sm:h-10" aria-hidden="true" />
              ) : (
                <dd className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                  {item.value.toLocaleString('pt-BR')}
                </dd>
              )}
              <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
