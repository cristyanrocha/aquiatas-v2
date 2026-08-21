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
import { partnerStore, partnerService } from '@/services/partnerService'
import type { Partner } from '@/types'
import { maskCNPJ, maskPhone } from '@/utils/masks'
import { ROUTES } from '@/constants/routes'

export function ParceirosListPage() {
  const { data: partners, isLoading } = useEntityStore(partnerStore)
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<Partner | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const table = useTableControls<Partner>({
    data: partners,
    searchFields: (item) => [item.nomeFantasia, item.razaoSocial, item.cnpj, item.cidade],
    sortFns: {
      nomeFantasia: (a, b) => a.nomeFantasia.localeCompare(b.nomeFantasia, 'pt-BR'),
    },
    defaultSortKey: 'nomeFantasia',
  })

  async function handleDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await partnerService.remove(pendingDelete.id)
      toast.success('Parceiro excluído com sucesso.')
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: DataTableColumn<Partner>[] = [
    {
      key: 'nomeFantasia',
      header: 'Parceiro',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img src={item.logoUrl} alt="" className="size-8 rounded-md border border-border object-cover" />
          <div>
            <p className="font-medium text-foreground">{item.nomeFantasia}</p>
            <p className="text-xs text-muted-foreground">{maskCNPJ(item.cnpj)}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'cidade',
      header: 'Local',
      render: (item) => <span className="text-muted-foreground">{item.cidade} / {item.estado}</span>,
    },
    {
      key: 'telefone',
      header: 'Telefone',
      render: (item) => <span className="text-muted-foreground">{maskPhone(item.telefone)}</span>,
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Editar ${item.nomeFantasia}`} onClick={() => navigate(ROUTES.adminParceirosEditar(item.id))}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Excluir ${item.nomeFantasia}`} onClick={() => setPendingDelete(item)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Parceiros" description="Gestão de parceiros." path={ROUTES.adminParceiros} />
      <AdminListHeader
        title="Parceiros"
        description="Empresas que divulgam atas na plataforma."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Buscar parceiro"
        newHref={ROUTES.adminParceirosNovo}
        newLabel="Novo parceiro"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhum parceiro encontrado"
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir parceiro"
        description={`Tem certeza que deseja excluir "${pendingDelete?.nomeFantasia}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
