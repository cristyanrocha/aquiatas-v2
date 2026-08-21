import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, Building2, Landmark, Users, CheckCircle2, AlertTriangle } from 'lucide-react'
import { StatCard, SimpleBarChart } from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Seo } from '@/components/common'
import { dashboardService, type DashboardSummary } from '@/services/dashboardService'
import { formatCurrencyBRL, formatDateBR } from '@/utils/format'
import { ROUTES } from '@/constants/routes'
import type { AtaSituacao } from '@/types'

const SITUATION_MAP: Record<DashboardSummary['latest_atas'][number]['situation'], AtaSituacao> = {
  active: 'vigente',
  expiring: 'proxima_vencimento',
  expired: 'vencida',
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    dashboardService
      .getSummary()
      .then((data) => {
        if (!cancelled) setSummary(data)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Dashboard" description="Painel administrativo AquiAtas." path={ROUTES.admin} />

      <div>
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma AquiAtas.</p>
      </div>

      {isLoading || !summary ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total de atas" value={summary.total_atas} icon={FileStack} />
            <StatCard label="Total de parceiros" value={summary.total_partners} icon={Building2} />
            <StatCard label="Total de órgãos" value={summary.total_agencies} icon={Landmark} />
            <StatCard label="Total de usuários" value={summary.total_users} icon={Users} />
            <StatCard label="Atas vigentes" value={summary.atas_active} icon={CheckCircle2} tone="success" />
            <StatCard label="Atas vencendo" value={summary.atas_expiring} icon={AlertTriangle} tone="warning" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SimpleBarChart
              title="Atas por categoria"
              data={summary.atas_by_category.map((item) => ({ label: item.category_name ?? '—', value: item.total }))}
            />
            <SimpleBarChart
              title="Atas por tipo"
              data={summary.atas_by_type.map((item) => ({ label: item.ata_type_name ?? '—', value: item.total }))}
            />
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Últimas atas cadastradas</h2>
              <Link to={ROUTES.adminAtas} className="text-xs font-medium text-brand hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Descrição</th>
                    <th className="px-5 py-2.5 font-medium">Órgão</th>
                    <th className="px-5 py-2.5 font-medium">Valor</th>
                    <th className="px-5 py-2.5 font-medium">Validade</th>
                    <th className="px-5 py-2.5 font-medium">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.latest_atas.map((ata) => (
                    <tr key={ata.id} className="border-b border-border last:border-0">
                      <td className="max-w-64 truncate px-5 py-3 font-medium text-foreground">{ata.title}</td>
                      <td className="px-5 py-3 text-muted-foreground">{ata.agency_name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatCurrencyBRL(ata.unit_price)}</td>
                      <td className="px-5 py-3 text-muted-foreground">{formatDateBR(ata.expiration_date)}</td>
                      <td className="px-5 py-3">
                        <StatusBadge situacao={SITUATION_MAP[ata.situation]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
