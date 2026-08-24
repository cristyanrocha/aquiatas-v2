import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Navigation } from './Navigation'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { canAccessAdminPanel, ROLE_LABELS } from '@/utils/permissions'
import { cn } from '@/lib/utils'

export function PublicHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b bg-background/85 backdrop-blur-md transition-shadow duration-300 supports-backdrop-filter:bg-background/70',
        scrolled ? 'border-border shadow-sm' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <a href={ROUTES.home} className="flex shrink-0 items-center">
          <img src="/images/logo.png" alt="AquiAtas" className="h-8 w-auto lg:h-10" />
        </a>

        <Navigation className="hidden lg:flex" />

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2.5 px-2.5">
                  <Avatar className="size-8">
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
                <DropdownMenuItem onClick={() => navigate(ROUTES.meuPerfil)}>
                  <UserRound />
                  Meu Perfil
                </DropdownMenuItem>
                {canAccessAdminPanel(user.role) && (
                  <DropdownMenuItem onClick={() => navigate(ROUTES.admin)}>
                    <LayoutDashboard />
                    Painel Administrativo
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button asChild variant="ghost">
                <Link to={ROUTES.login}>Entrar</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={ROUTES.cadastro}>Criar conta</Link>
              </Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4 pb-4">
                <Navigation orientation="vertical" onNavigate={() => setMobileOpen(false)} />
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" onClick={() => setMobileOpen(false)}>
                      <Link to={ROUTES.login}>Entrar</Link>
                    </Button>
                    <Button asChild variant="secondary" onClick={() => setMobileOpen(false)}>
                      <Link to={ROUTES.cadastro}>Criar conta</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
