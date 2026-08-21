import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { canAccessAdminPanel } from '@/utils/permissions'
import { ROUTES } from '@/constants/routes'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" role="status" aria-label="Carregando" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  if (!canAccessAdminPanel(user?.role)) {
    return <Navigate to={ROUTES.forbidden} replace />
  }

  return <Outlet />
}
