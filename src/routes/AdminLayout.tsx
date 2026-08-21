import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import { ROUTES } from '@/constants/routes'

const NEW_ROUTE_BY_SECTION: Record<string, string> = {
  [ROUTES.adminAtas]: ROUTES.adminAtasNova,
  [ROUTES.adminParceiros]: ROUTES.adminParceirosNovo,
  [ROUTES.adminCategorias]: ROUTES.adminCategoriasNova,
  [ROUTES.adminTipos]: ROUTES.adminTiposNovo,
  [ROUTES.adminOrgaos]: ROUTES.adminOrgaosNovo,
  [ROUTES.adminUsuarios]: ROUTES.adminUsuariosNovo,
}

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useKeyboardShortcut(
    'n',
    () => {
      const target = NEW_ROUTE_BY_SECTION[location.pathname]
      if (target) navigate(target)
    },
    { alt: true },
  )

  return (
    <div className="flex min-h-svh bg-background">
      <AdminSidebar className="hidden w-64 shrink-0 lg:flex" />

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0 [&>button]:hidden">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu do painel</SheetTitle>
          </SheetHeader>
          <AdminSidebar className="w-full" onNavigate={() => setMobileOpen(false)} onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
