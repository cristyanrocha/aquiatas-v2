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
import { ataTypeStore, ataTypeService } from '@/services/ataTypeService'
import type { AtaType } from '@/types'
import { formatDateBR } from '@/utils/format'
import { ROUTES } from '@/constants/routes'

export function TiposListPage() {
  const { data: ataTypes, isLoading } = useEntityStore(ataTypeStore)
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<AtaType | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const table = useTableControls<AtaType>({
    data: ataTypes,
    searchFields: (item) => [item.nome],
    sortFns: {
      nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
      createdAt: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    defaultSortKey: 'nome',
  })

  async function handleDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await ataTypeService.remove(pendingDelete.id)
      toast.success('Tipo de ata excluído com sucesso.')
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: DataTableColumn<AtaType>[] = [
    { key: 'nome', header: 'Nome', sortable: true, render: (item) => <span className="font-medium text-foreground">{item.nome}</span> },
    {
      key: 'createdAt',
      header: 'Criado em',
      sortable: true,
      render: (item) => <span className="text-muted-foreground">{formatDateBR(item.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Editar ${item.nome}`} onClick={() => navigate(ROUTES.adminTiposEditar(item.id))}>
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
      <Seo title="Tipos de Ata" description="Gestão de tipos de ata." path={ROUTES.adminTipos} />
      <AdminListHeader
        title="Tipos de Ata"
        description="Tipos utilizados para classificar as atas cadastradas."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Buscar tipo"
        newHref={ROUTES.adminTiposNovo}
        newLabel="Novo tipo"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhum tipo encontrado"
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir tipo de ata"
        description={`Tem certeza que deseja excluir "${pendingDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
