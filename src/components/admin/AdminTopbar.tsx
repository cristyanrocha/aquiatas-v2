import { Menu, LogOut, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AppBreadcrumb } from '@/components/common/Breadcrumb'
import { useAuth } from '@/hooks/useAuth'
import { ROLE_LABELS } from '@/utils/permissions'
import { ROUTES } from '@/constants/routes'

export function AdminTopbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenSidebar} aria-label="Abrir menu">
          <Menu className="size-5" />
        </Button>
        <AppBreadcrumb className="hidden sm:block" />
      </div>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="size-7">
                <AvatarImage src={user.avatarUrl} alt="" />
                <AvatarFallback>{user.nome.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{user.nome.split(' ')[0]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-medium">{user.nome}</span>
              <span className="text-xs font-normal text-muted-foreground">{ROLE_LABELS[user.role]}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={ROUTES.home}>
                <ExternalLink />
                Ver site público
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}
