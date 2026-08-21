import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminListHeader } from '@/components/admin'
import { DataTable, type DataTableColumn } from '@/components/common/DataTable'
import { AppPagination } from '@/components/common/Pagination'
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog'
import { Seo, toast } from '@/components/common'
import { useEntityStore } from '@/hooks/useEntityStore'
import { useTableControls } from '@/hooks/useTableControls'
import { useAuth } from '@/hooks/useAuth'
import { userStore, userService } from '@/services/userService'
import type { User } from '@/types'
import { ROLE_LABELS } from '@/utils/permissions'
import { ROUTES } from '@/constants/routes'

export function UsuariosListPage() {
  const { data: users, isLoading } = useEntityStore(userStore)
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const table = useTableControls<User>({
    data: users,
    searchFields: (item) => [item.nome, item.email, item.orgaoPublico],
    sortFns: {
      nome: (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
      role: (a, b) => a.role.localeCompare(b.role),
    },
    defaultSortKey: 'nome',
  })

  async function handleDelete() {
    if (!pendingDelete) return
    setIsDeleting(true)
    try {
      await userService.remove(pendingDelete.id)
      toast.success('Usuário excluído com sucesso.')
      setPendingDelete(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível excluir o usuário.')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleToggleStatus(item: User) {
    setTogglingId(item.id)
    try {
      await userService.setStatus(item.id, item.ativo ? 'inactive' : 'active')
      toast.success(item.ativo ? 'Usuário desativado.' : 'Usuário ativado.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível alterar o status do usuário.')
    } finally {
      setTogglingId(null)
    }
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: 'nome',
      header: 'Usuário',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img src={item.avatarUrl} alt="" className="size-8 rounded-full border border-border object-cover" />
          <div>
            <p className="font-medium text-foreground">{item.nome}</p>
            <p className="text-xs text-muted-foreground">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'orgaoPublico',
      header: 'Empresa / Órgão Público',
      render: (item) => <span className="text-muted-foreground">{item.orgaoPublico}</span>,
    },
    {
      key: 'role',
      header: 'Perfil',
      sortable: true,
      render: (item) => <Badge variant="secondary">{ROLE_LABELS[item.role]}</Badge>,
    },
    {
      key: 'ativo',
      header: 'Status',
      render: (item) => {
        const isSelf = item.id === currentUser?.id
        return (
          <button
            type="button"
            disabled={isSelf || togglingId === item.id}
            onClick={() => handleToggleStatus(item)}
            title={isSelf ? 'Você não pode alterar o status da própria conta.' : 'Clique para alternar o status.'}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Badge className={item.ativo ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
              {item.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
          </button>
        )
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label={`Editar ${item.nome}`} onClick={() => navigate(ROUTES.adminUsuariosEditar(item.id))}>
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Excluir ${item.nome}`}
            disabled={item.id === currentUser?.id}
            onClick={() => setPendingDelete(item)}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <Seo title="Usuários" description="Gestão de usuários." path={ROUTES.adminUsuarios} />
      <AdminListHeader
        title="Usuários"
        description="Usuários com acesso à plataforma e ao painel administrativo."
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Buscar usuário"
        newHref={ROUTES.adminUsuariosNovo}
        newLabel="Novo usuário"
      />
      <DataTable
        columns={columns}
        data={table.paged}
        rowKey={(item) => item.id}
        sortKey={table.sortKey}
        sortDirection={table.sortDirection}
        onSortChange={table.onSortChange}
        isLoading={isLoading}
        emptyTitle="Nenhum usuário encontrado"
      />
      <div className="flex justify-center">
        <AppPagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} />
      </div>

      <ConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Excluir usuário"
        description={`Tem certeza que deseja excluir "${pendingDelete?.nome}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        destructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  )
}
