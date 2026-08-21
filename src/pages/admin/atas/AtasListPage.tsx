import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AdminListHeader } from '@/components/admin'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { AppPagination } from '@/components/common/Pagination'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Seo, toast } from '@/components/common'
import { useEntityStore } from '@/hooks/useEntityStore'
import { useTableControls } from '@/hooks/useTableControls'
import { ataStore, ataService } from '@/services/ataService'
import type { AtaWithRelations } from '@/types'
import { formatCurrencyBRL, formatDateBR } from '@/utils/format'
import { ROUTES } from '@/constants/routes'

export function AtasListPage() {
  const { data: atas, isLoading } = useEntityStore(ataStore)
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<AtaWithRelations | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const table = useTableControls<AtaWithRelations>({
    data: atas,
    searchFields: (item) => [item.descricao, item.marcaNome, item.orgaoNome, item.numeroAta],
    sortFns: {
      descricao: (a, b) => a.descricao.localeCompare(b.descricao, 'pt-BR'),
      valorUnitario: (a, b) => a.valorUnitario - b.valorUnitario,
      dataVigenciaFim: (a, b) => a.dataVigenciaFim.localeCompare(b.dataVigenciaFim),
    },
    defaultSortKey: 'descricao',
  })

  async function handleDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await ataService.remove(pendingDelete.id)
      toast.success('Ata excluída com sucesso.')
      setPendingDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: DataTableColumn<AtaWithRelations>[] = [
    {
      key: 'descricao',
      header: 'Ata',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img src={item.imagemUrl} alt="" className="size-10 shrink-0 rounded-md border border-border object-cover" />
          <div className="max-w-72">
            <p className="truncate font-medium text-foreground">{item.descricao}</p>
            <p className="text-xs text-muted-foreground">{item.categoriaNome} • {item.marcaNome}</p>
          </div>
        </div>
      ),
    },
    { key: 'orgaoNome', header: 'Órgão', render: (item) => <span className="text-muted-foreground">{item.orgaoNome}</span> },
    {
      key: 'valorUnitario',
      header: 'Valor',
      sortable: true,
      render: (item) => <span className="text-muted-foreground">{formatCurrencyBRL(item.valorUnitario)}</span>,
    },
    {
      key: 'dataVigenciaFim',
      header: 'Validade',
      sortable: true,
      render: (item) => <span className="text-muted-foreground">{formatDateBR(item.dataVigenciaFim)}</span>,
    },
    { key: 'situacao', header: 'Situação', render: (item) => <StatusBadge situacao={item.situacao} /> },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Editar ${item.descricao}`} onClick={() => navigate(ROUTES.adminAtasEditar(item.id))}>
            <Pencil className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label={`Excluir ${item.descricao}`} onClick={() => setPendingDelete(item)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Atas" description="Gestão de Atas de Registro de Preços." path={ROUTES.adminAtas} />
      <AdminListHeader
        title="Itens das Atas"
        description="Itens das Atas de Registro de Preços divulgados na plataforma."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Buscar ata"
        newHref={ROUTES.adminAtasNova}
        newLabel="Novo Item"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhuma ata encontrada"
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir ata"
        description={`Tem certeza que deseja excluir "${pendingDelete?.descricao}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
