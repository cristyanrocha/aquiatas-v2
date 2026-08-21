import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminListHeader } from '@/components/admin'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { AppPagination } from '@/components/common/Pagination'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { Seo, toast } from '@/components/common'
import { useEntityStore } from '@/hooks/useEntityStore'
import { useTableControls } from '@/hooks/useTableControls'
import { agencyStore, agencyService } from '@/services/agencyService'
import type { Agency } from '@/types'
import { ROUTES } from '@/constants/routes'

export function OrgaosListPage() {
  const { data: agencies, isLoading } = useEntityStore(agencyStore)
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<Agency | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const table = useTableControls<Agency>({
    data: agencies,
    searchFields: (item) => [item.nome, item.sigla, item.cidade, item.estado],
    sortFns: {
      nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
      estado: (a, b) => a.estado.localeCompare(b.estado),
    },
    defaultSortKey: 'nome',
  })

  async function handleDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await agencyService.remove(pendingDelete.id)
      toast.success('Órgão excluído com sucesso.')
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: DataTableColumn<Agency>[] = [
    {
      key: 'nome',
      header: 'Órgão',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img src={item.logoUrl} alt="" className="size-8 rounded-md border border-border object-cover" />
          <div>
            <p className="font-medium text-foreground">{item.nome}</p>
            <p className="text-xs text-muted-foreground">{item.sigla}</p>
          </div>
        </div>
      ),
    },
    { key: 'esfera', header: 'Esfera', render: (item) => <span className="text-muted-foreground">{item.esfera}</span> },
    {
      key: 'estado',
      header: 'Local',
      sortable: true,
      render: (item) => <span className="text-muted-foreground">{item.cidade} / {item.estado}</span>,
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Editar ${item.nome}`} onClick={() => navigate(ROUTES.adminOrgaosEditar(item.id))}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Excluir ${item.nome}`} onClick={() => setPendingDelete(item)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Órgãos" description="Gestão de órgãos públicos." path={ROUTES.adminOrgaos} />
      <AdminListHeader
        title="Órgãos Públicos"
        description="Órgãos que divulgam Atas de Registro de Preços."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Buscar órgão"
        newHref={ROUTES.adminOrgaosNovo}
        newLabel="Novo órgão"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhum órgão encontrado"
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir órgão"
        description={`Tem certeza que deseja excluir "${pendingDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
