import { useState } from 'react'
import { Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AdminListHeader } from '@/components/admin'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { AppPagination } from '@/components/common/Pagination'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { FormField, Seo, toast } from '@/components/common'
import { useEntityStore } from '@/hooks/useEntityStore'
import { useTableControls } from '@/hooks/useTableControls'
import { brandStore, brandService } from '@/services/brandService'
import type { Brand } from '@/types'
import { ROUTES } from '@/constants/routes'

export function MarcasListPage() {
  const { data: brands, isLoading } = useEntityStore(brandStore)
  const [pendingDelete, setPendingDelete] = useState<Brand | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [createError, setCreateError] = useState<string>()
  const [isCreating, setIsCreating] = useState(false)

  const table = useTableControls<Brand>({
    data: brands,
    searchFields: (item) => [item.nome],
    sortFns: {
      nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }),
    },
    defaultSortKey: 'nome',
  })

  function openCreateDialog() {
    setNewBrandName('')
    setCreateError(undefined)
    setCreateOpen(true)
  }

  async function handleCreate() {
    const name = newBrandName.trim()
    if (!name) {
      setCreateError('Informe o nome da marca.')
      return
    }
    setIsCreating(true)
    try {
      const { alreadyExisted } = await brandService.create(name)
      if (alreadyExisted) {
        setCreateError('Esta marca já está cadastrada.')
        return
      }
      toast.success('Marca cadastrada com sucesso!')
      setCreateOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível cadastrar a marca. Tente novamente.')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await brandService.remove(pendingDelete.id)
      toast.success('Marca excluída com sucesso.')
      setPendingDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível excluir a marca. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: DataTableColumn<Brand>[] = [
    {
      key: 'nome',
      header: 'Marca',
      sortable: true,
      render: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Excluir ${item.nome}`} onClick={() => setPendingDelete(item)}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Marcas" description="Gestão de marcas utilizadas nos Itens das Atas." path={ROUTES.adminMarcas} />
      <AdminListHeader
        title="Marcas"
        description="Gerencie as marcas utilizadas nos Itens das Atas."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Pesquisar marca..."
        onNewClick={openCreateDialog}
        newLabel="Nova Marca"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhuma marca cadastrada"
        emptyDescription="Cadastre sua primeira marca para utilizá-la nos Itens das Atas."
        emptyAction={
          <Button onClick={openCreateDialog} className="mt-1">
            <Tag className="size-4" />
            Cadastrar Marca
          </Button>
        }
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nova Marca</DialogTitle>
            <DialogDescription>Cadastre uma nova marca para uso nos Itens das Atas.</DialogDescription>
          </DialogHeader>
          <FormField label="Nome da Marca" error={createError} required>
            <Input
              value={newBrandName}
              onChange={(event) => {
                setNewBrandName(event.target.value)
                if (createError) setCreateError(undefined)
              }}
              placeholder="Dell"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  void handleCreate()
                }
              }}
            />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={isCreating}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreate} disabled={isCreating}>
              {isCreating ? 'Cadastrando...' : 'Cadastrar Marca'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir marca?"
        description={`Tem certeza de que deseja excluir "${pendingDelete?.nome}"? Esta ação não poderá ser desfeita.`}
        confirmLabel="Excluir Marca"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
