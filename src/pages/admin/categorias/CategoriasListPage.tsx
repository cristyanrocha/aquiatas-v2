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
import { categoryStore, categoryService } from '@/services/categoryService'
import type { Category } from '@/types'
import { formatDateBR } from '@/utils/format'
import { ROUTES } from '@/constants/routes'

export function CategoriasListPage() {
  const { data: categories, isLoading } = useEntityStore(categoryStore)
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const table = useTableControls<Category>({
    data: categories,
    searchFields: (item) => [item.nome, item.slug],
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
      await categoryService.remove(pendingDelete.id)
      toast.success('Categoria excluída com sucesso.')
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: DataTableColumn<Category>[] = [
    {
      key: 'nome',
      header: 'Categoria',
      sortable: true,
      render: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
    },
    { key: 'slug', header: 'Slug', render: (item) => <span className="text-muted-foreground">{item.slug}</span> },
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
          <Button variant="ghost" size="icon" aria-label={`Editar ${item.nome}`} onClick={() => navigate(ROUTES.adminCategoriasEditar(item.id))}>
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
      <Seo title="Categorias" description="Gestão de categorias de atas." path={ROUTES.adminCategorias} />
      <AdminListHeader
        title="Categorias"
        description="Categorias utilizadas para classificar as atas."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Buscar categoria"
        newHref={ROUTES.adminCategoriasNova}
        newLabel="Nova categoria"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhuma categoria encontrada"
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${pendingDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
