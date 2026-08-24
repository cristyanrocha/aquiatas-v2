import { NavLink } from 'react-router-dom'
import { FileStack, X } from 'lucide-react'
import { ADMIN_NAV_ITEMS } from '@/constants/adminNav'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  className?: string
  onNavigate?: () => void
  onClose?: () => void
}

export function AdminSidebar({ className, onNavigate, onClose }: AdminSidebarProps) {
  return (
    <div className={cn('flex h-full flex-col bg-sidebar text-sidebar-foreground', className)}>
      <div className="flex h-16 items-center justify-between px-4">
        <a href={ROUTES.home} className="flex items-center gap-2 font-semibold">
          <FileStack className="size-6" aria-hidden="true" />
          <span className="font-display text-lg tracking-tight">AquiAtas</span>
        </a>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-sidebar-foreground lg:hidden">
            <X className="size-5" />
          </Button>
        )}
      </div>
      <nav aria-label="Navegação do painel administrativo" className="flex flex-1 flex-col gap-1 px-3 py-2">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === ROUTES.adminDashboard}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && 'border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground',
              )
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 text-xs text-sidebar-foreground/50">Painel Administrativo</div>
    </div>
  )
}
