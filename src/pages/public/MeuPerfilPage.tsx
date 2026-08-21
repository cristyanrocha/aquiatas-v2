import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { UserRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormField, Seo } from '@/components/common'
import { MaskedInput } from '@/components/forms'
import { AuthPageShell } from '@/components/public'
import { useAuth } from '@/hooks/useAuth'
import { maskPhone, unmask } from '@/utils/masks'
import { isValidPhoneDigits, validateOrgaoPublico } from '@/utils/validation'
import { ROUTES } from '@/constants/routes'

interface FormState {
  nome: string
  telefone: string
  orgaoPublico: string
}

export function MeuPerfilPage() {
  const { user, isAuthenticated, isLoading, updateProfile } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState<FormState>({ nome: '', telefone: '', orgaoPublico: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({ nome: user.nome, telefone: user.telefone ?? '', orgaoPublico: user.orgaoPublico })
  }, [user])

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (!isLoading && !isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.nome.trim()) nextErrors.nome = 'Informe seu nome completo.'
    if (form.telefone.trim() && !isValidPhoneDigits(form.telefone)) nextErrors.telefone = 'Telefone inválido.'
    const orgaoPublicoError = validateOrgaoPublico(form.orgaoPublico)
    if (orgaoPublicoError) nextErrors.orgaoPublico = orgaoPublicoError
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await updateProfile({
        nome: form.nome.trim().replace(/\s+/g, ' '),
        telefone: unmask(form.telefone) || undefined,
        orgaoPublico: form.orgaoPublico.trim(),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <p className="mx-auto max-w-md px-4 py-16 text-center text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <>
      <Seo title="Meu Perfil" description="Atualize as informações do seu perfil na AquiAtas." path={ROUTES.meuPerfil} />
      <AuthPageShell icon={UserRound} title="Meu Perfil" description="Atualize suas informações cadastrais.">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormField label="Nome completo" error={errors.nome} required>
            <Input value={form.nome} onChange={(event) => update('nome', event.target.value)} autoComplete="name" />
          </FormField>

          <FormField label="Email">
            <Input value={user.email} disabled />
          </FormField>

          <FormField label="Telefone ou celular" error={errors.telefone} hint={!errors.telefone ? 'Opcional' : undefined}>
            <MaskedInput
              mask={maskPhone}
              value={form.telefone}
              onChange={(value) => update('telefone', value)}
              placeholder="(00) 00000-0000"
              autoComplete="tel"
            />
          </FormField>

          <FormField label="Empresa / Órgão Público" error={errors.orgaoPublico} required>
            <Input
              value={form.orgaoPublico}
              onChange={(event) => update('orgaoPublico', event.target.value)}
              maxLength={150}
              autoComplete="organization"
              placeholder="Digite o nome da empresa ou órgão público"
            />
          </FormField>

          <Button type="submit" disabled={isSubmitting} className="mt-1">
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </AuthPageShell>
    </>
  )
}
