import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, FileStack, XCircle } from 'lucide-react'
import { Seo } from '@/components/common'
import { supabase } from '@/integrations/supabase/client'
import { ROUTES } from '@/constants/routes'

type CallbackState = 'loading' | 'success' | 'error'

/**
 * Landing page for Supabase Auth email links (signup confirmation, magic link).
 * The client is created with `detectSessionInUrl: true`, so it parses the URL and
 * establishes the session automatically — this page just waits for that to resolve.
 * Password recovery links go to /redefinir-senha instead (see authService.requestPasswordReset).
 */
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<CallbackState>('loading')

  useEffect(() => {
    let cancelled = false

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (cancelled) return
      if (event === 'SIGNED_IN') {
        setState('success')
        setTimeout(() => navigate(ROUTES.home, { replace: true }), 1500)
      }
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) return
      if (error) {
        setState('error')
        return
      }
      if (data.session) {
        setState('success')
        setTimeout(() => navigate(ROUTES.home, { replace: true }), 1500)
      } else {
        // Give onAuthStateChange a moment to process the URL before giving up.
        setTimeout(() => {
          if (!cancelled) {
            supabase.auth.getSession().then(({ data: retry }) => {
              if (cancelled) return
              setState(retry.session ? 'success' : 'error')
              if (retry.session) setTimeout(() => navigate(ROUTES.home, { replace: true }), 1500)
            })
          }
        }, 1500)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [navigate])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <Seo title="Confirmando acesso" description="Confirmando seu acesso à AquiAtas." path={ROUTES.authCallback} />

      <FileStack className="mb-4 size-8 text-brand" aria-hidden="true" />

      {state === 'loading' && (
        <>
          <div
            className="mb-4 size-8 animate-spin rounded-full border-2 border-brand border-t-transparent"
            role="status"
            aria-label="Confirmando"
          />
          <h1 className="text-xl font-semibold text-foreground">Confirmando seu acesso...</h1>
          <p className="mt-2 text-sm text-muted-foreground">Aguarde um instante.</p>
        </>
      )}

      {state === 'success' && (
        <>
          <CheckCircle2 className="mb-4 size-10 text-success" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-foreground">Conta confirmada!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Redirecionando para a página inicial...</p>
        </>
      )}

      {state === 'error' && (
        <>
          <XCircle className="mb-4 size-10 text-destructive" aria-hidden="true" />
          <h1 className="text-xl font-semibold text-foreground">Não foi possível confirmar o acesso</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            O link pode ter expirado ou já ter sido utilizado. Tente entrar novamente ou solicite um novo link.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to={ROUTES.login} className="font-medium text-brand hover:underline">
              Ir para o login
            </Link>
            <Link to={ROUTES.home} className="font-medium text-brand hover:underline">
              Página inicial
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
