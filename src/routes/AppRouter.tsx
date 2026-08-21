import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './PublicLayout'
import { AdminLayout } from './AdminLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { ScrollToTop } from './ScrollToTop'
import { CommandPalette } from '@/components/public'
import { ROUTES } from '@/constants/routes'

const HomePage = lazy(() => import('@/pages/public/HomePage').then((m) => ({ default: m.HomePage })))
const ParceirosPage = lazy(() => import('@/pages/public/ParceirosPage').then((m) => ({ default: m.ParceirosPage })))
const OrgaosPage = lazy(() => import('@/pages/public/OrgaosPage').then((m) => ({ default: m.OrgaosPage })))
const QuemSomosPage = lazy(() => import('@/pages/public/QuemSomosPage').then((m) => ({ default: m.QuemSomosPage })))
const PrecosPage = lazy(() => import('@/pages/public/PrecosPage').then((m) => ({ default: m.PrecosPage })))
const ContatoPage = lazy(() => import('@/pages/public/ContatoPage').then((m) => ({ default: m.ContatoPage })))
const LoginPage = lazy(() => import('@/pages/public/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AuthCallbackPage = lazy(() => import('@/pages/public/AuthCallbackPage').then((m) => ({ default: m.AuthCallbackPage })))
const EsqueciMinhaSenhaPage = lazy(() =>
  import('@/pages/public/EsqueciMinhaSenhaPage').then((m) => ({ default: m.EsqueciMinhaSenhaPage })),
)
const RedefinirSenhaPage = lazy(() =>
  import('@/pages/public/RedefinirSenhaPage').then((m) => ({ default: m.RedefinirSenhaPage })),
)
const TermosDeUsoPage = lazy(() => import('@/pages/public/TermosDeUsoPage').then((m) => ({ default: m.TermosDeUsoPage })))
const PoliticaDePrivacidadePage = lazy(() =>
  import('@/pages/public/PoliticaDePrivacidadePage').then((m) => ({ default: m.PoliticaDePrivacidadePage })),
)
const MeuPerfilPage = lazy(() => import('@/pages/public/MeuPerfilPage').then((m) => ({ default: m.MeuPerfilPage })))
const AtaDetailPage = lazy(() => import('@/pages/public/AtaDetailPage').then((m) => ({ default: m.AtaDetailPage })))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const ForbiddenPage = lazy(() => import('@/pages/public/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })))

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const AtasListPage = lazy(() => import('@/pages/admin/atas/AtasListPage').then((m) => ({ default: m.AtasListPage })))
const AtaFormPage = lazy(() => import('@/pages/admin/atas/AtaFormPage').then((m) => ({ default: m.AtaFormPage })))
const ParceirosListPage = lazy(() => import('@/pages/admin/parceiros/ParceirosListPage').then((m) => ({ default: m.ParceirosListPage })))
const ParceiroFormPage = lazy(() => import('@/pages/admin/parceiros/ParceiroFormPage').then((m) => ({ default: m.ParceiroFormPage })))
const CategoriasListPage = lazy(() => import('@/pages/admin/categorias/CategoriasListPage').then((m) => ({ default: m.CategoriasListPage })))
const CategoriaFormPage = lazy(() => import('@/pages/admin/categorias/CategoriaFormPage').then((m) => ({ default: m.CategoriaFormPage })))
const TiposListPage = lazy(() => import('@/pages/admin/tipos/TiposListPage').then((m) => ({ default: m.TiposListPage })))
const TipoFormPage = lazy(() => import('@/pages/admin/tipos/TipoFormPage').then((m) => ({ default: m.TipoFormPage })))
const OrgaosListPage = lazy(() => import('@/pages/admin/orgaos/OrgaosListPage').then((m) => ({ default: m.OrgaosListPage })))
const OrgaoFormPage = lazy(() => import('@/pages/admin/orgaos/OrgaoFormPage').then((m) => ({ default: m.OrgaoFormPage })))
const UsuariosListPage = lazy(() => import('@/pages/admin/usuarios/UsuariosListPage').then((m) => ({ default: m.UsuariosListPage })))
const UsuarioFormPage = lazy(() => import('@/pages/admin/usuarios/UsuarioFormPage').then((m) => ({ default: m.UsuarioFormPage })))

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" role="status" aria-label="Carregando" />
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CommandPalette />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.parceiros} element={<ParceirosPage />} />
            <Route path={ROUTES.orgaos} element={<OrgaosPage />} />
            <Route path={ROUTES.quemSomos} element={<QuemSomosPage />} />
            <Route path={ROUTES.precos} element={<PrecosPage />} />
            <Route path={ROUTES.contato} element={<ContatoPage />} />
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.cadastro} element={<RegisterPage />} />
            <Route path={ROUTES.criarConta} element={<RegisterPage />} />
            <Route path={ROUTES.authCallback} element={<AuthCallbackPage />} />
            <Route path={ROUTES.esqueciMinhaSenha} element={<EsqueciMinhaSenhaPage />} />
            <Route path={ROUTES.redefinirSenha} element={<RedefinirSenhaPage />} />
            <Route path={ROUTES.termosDeUso} element={<TermosDeUsoPage />} />
            <Route path={ROUTES.politicaDePrivacidade} element={<PoliticaDePrivacidadePage />} />
            <Route path={ROUTES.meuPerfil} element={<MeuPerfilPage />} />
            <Route path="/atas/:slug" element={<AtaDetailPage />} />
            <Route path={ROUTES.forbidden} element={<ForbiddenPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path={ROUTES.adminDashboard} element={<DashboardPage />} />

              <Route path={ROUTES.adminAtas} element={<AtasListPage />} />
              <Route path={ROUTES.adminAtasNova} element={<AtaFormPage />} />
              <Route path="/admin/atas/:id/editar" element={<AtaFormPage />} />

              <Route path={ROUTES.adminParceiros} element={<ParceirosListPage />} />
              <Route path={ROUTES.adminParceirosNovo} element={<ParceiroFormPage />} />
              <Route path="/admin/parceiros/:id/editar" element={<ParceiroFormPage />} />

              <Route path={ROUTES.adminCategorias} element={<CategoriasListPage />} />
              <Route path={ROUTES.adminCategoriasNova} element={<CategoriaFormPage />} />
              <Route path="/admin/categorias/:id/editar" element={<CategoriaFormPage />} />

              <Route path={ROUTES.adminTipos} element={<TiposListPage />} />
              <Route path={ROUTES.adminTiposNovo} element={<TipoFormPage />} />
              <Route path="/admin/tipos/:id/editar" element={<TipoFormPage />} />

              <Route path={ROUTES.adminOrgaos} element={<OrgaosListPage />} />
              <Route path={ROUTES.adminOrgaosNovo} element={<OrgaoFormPage />} />
              <Route path="/admin/orgaos/:id/editar" element={<OrgaoFormPage />} />

              <Route path={ROUTES.adminUsuarios} element={<UsuariosListPage />} />
              <Route path={ROUTES.adminUsuariosNovo} element={<UsuarioFormPage />} />
              <Route path="/admin/usuarios/:id/editar" element={<UsuarioFormPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
