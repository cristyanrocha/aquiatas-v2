import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, Building2, Landmark, Users, CheckCircle2, AlertTriangle } from 'lucide-react'
import { StatCard, SimpleBarChart } from '@/components/admin'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DataTable, Seo, type DataTableColumn } from '@/components/common'
import { dashboardService, type DashboardSummary } from '@/services/dashboardService'
import { formatCurrencyBRL, formatDateBR } from '@/utils/format'
import { ROUTES } from '@/constants/routes'
import type { AtaSituacao } from '@/types'

type LatestAta = DashboardSummary['latest_atas'][number]

const SITUATION_MAP: Record<DashboardSummary['latest_atas'][number]['situation'], AtaSituacao> = {
  active: 'vigente',
  expiring: 'proxima_vencimento',
  expired: 'vencida',
}

const LATEST_ATAS_COLUMNS: DataTableColumn<LatestAta>[] = [
  { key: 'title', header: 'Descrição', render: (ata) => <span className="max-w-64 truncate font-medium text-foreground">{ata.title}</span> },
  { key: 'agency_name', header: 'Órgão', render: (ata) => ata.agency_name },
  { key: 'unit_price', header: 'Valor', render: (ata) => formatCurrencyBRL(ata.unit_price) },
  { key: 'expiration_date', header: 'Validade', render: (ata) => formatDateBR(ata.expiration_date) },
  { key: 'situation', header: 'Situação', render: (ata) => <StatusBadge situacao={SITUATION_MAP[ata.situation]} /> },
]

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
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">Dashboard</h1>
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

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold text-foreground">Últimas atas cadastradas</h2>
              <Link to={ROUTES.adminAtas} className="text-xs font-medium text-brand hover:underline">
                Ver todas
              </Link>
            </div>
            <DataTable
              columns={LATEST_ATAS_COLUMNS}
              data={summary.latest_atas}
              rowKey={(ata) => String(ata.id)}
              emptyTitle="Nenhuma ata cadastrada"
              emptyDescription="Cadastre a primeira ata para vê-la aqui."
            />
          </div>
        </>
      )}
    </div>
  )
}
