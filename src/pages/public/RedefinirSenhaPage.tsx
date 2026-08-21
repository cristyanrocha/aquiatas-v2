import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FormField, Seo, toast } from '@/components/common'
import { PasswordInput } from '@/components/forms'
import { AuthPageShell } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { ROUTES } from '@/constants/routes'
import { isStrongPassword } from '@/utils/validation'

export function RedefinirSenhaPage() {
  const { updatePassword, logout } = useAuth()
  const navigate = useNavigate()
  const [isRecoverySession, setIsRecoverySession] = useState<boolean | null>(null)
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [errors, setErrors] = useState<{ senha?: string; confirmarSenha?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsRecoverySession(true)
    })

    // The recovery link may have already been processed before this listener attached.
    supabase.auth.getSession().then(({ data }) => {
      setIsRecoverySession((current) => current ?? (data.session ? true : false))
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (isSubmitting) return

    const nextErrors: { senha?: string; confirmarSenha?: string } = {}
    if (!isStrongPassword(senha)) {
      nextErrors.senha = 'A senha deve ter no mínimo 8 caracteres, incluindo letra e número.'
    }
    if (confirmarSenha !== senha) {
      nextErrors.confirmarSenha = 'As senhas não coincidem.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await updatePassword(senha)
      await logout()
      toast.success('Senha redefinida com sucesso. Entre com sua nova senha.')
      navigate(ROUTES.login, { replace: true })
    } catch {
      // updatePassword already surfaces a translated toast on failure.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Seo title="Redefinir senha" description="Defina uma nova senha para sua conta AquiAtas." path={ROUTES.redefinirSenha} />
      <AuthPageShell title="Redefinir senha" description="Escolha uma nova senha para acessar sua conta.">
        {isRecoverySession === false ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <p className="text-sm text-foreground">
              Este link é inválido ou já expirou. Solicite um novo link de redefinição de senha.
            </p>
            <Link to={ROUTES.esqueciMinhaSenha} className="font-medium text-brand hover:underline">
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormField
              label="Nova senha"
              error={errors.senha}
              required
              hint={!errors.senha ? 'Mínimo de 8 caracteres, com letra e número.' : undefined}
            >
              <PasswordInput value={senha} onChange={(event) => setSenha(event.target.value)} autoComplete="new-password" autoFocus />
            </FormField>
            <FormField label="Confirmar nova senha" error={errors.confirmarSenha} required>
              <PasswordInput
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                autoComplete="new-password"
              />
            </FormField>
            <Button type="submit" disabled={isSubmitting || isRecoverySession === null} className="mt-1">
              {isSubmitting ? 'Salvando...' : 'Redefinir senha'}
            </Button>
          </form>
        )}
      </AuthPageShell>
    </>
  )
}
