import { Outlet } from 'react-router-dom'
import { PublicHeader, PublicFooter } from '@/components/public'
import { WhatsAppFloatingButton } from '@/components/common'
import { AppBreadcrumb } from '@/components/common/Breadcrumb'
import { useLocation } from 'react-router-dom'

export function PublicLayout() {
  const location = useLocation()
  const showBreadcrumb = location.pathname !== '/'

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo principal
      </a>
      <PublicHeader />
      {showBreadcrumb && (
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <AppBreadcrumb />
        </div>
      )}
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <WhatsAppFloatingButton />
    </div>
  )
}
