import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormField, toast } from '@/components/common'
import { PasswordInput, MaskedInput } from '@/components/forms'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
import { maskPhone, unmask } from '@/utils/masks'
import { validateRegisterForm, hasErrors } from '@/utils/validation'
import { EMAIL_ALREADY_REGISTERED_MESSAGE } from '@/services/authService'
import type { RegisterFormData, RegisterFormErrors } from '@/types'

const RESEND_COOLDOWN_SECONDS = 30

const INITIAL_FORM: RegisterFormData = {
  nome: '',
  email: '',
  telefone: '',
  orgaoPublico: '',
  senha: '',
  confirmarSenha: '',
  aceitarTermos: false,
}

interface RegisterFormProps {
  /** Prefixes field ids so this form can be mounted more than once at a time (page + dialog) without id clashes. */
  idPrefix: string
  onSuccess: () => void
}

export function RegisterForm({ idPrefix, onSuccess }: RegisterFormProps) {
  const { register, isLoading, resendConfirmationEmail } = useAuth()
  const [form, setForm] = useState<RegisterFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const busy = isSubmitting || isLoading

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((seconds) => seconds - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  function fieldId(field: string) {
    return `${idPrefix}-${field}`
  }

  function update<K extends keyof RegisterFormData>(field: K, value: RegisterFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (busy) return // evita cadastro duplicado por cliques repetidos

    const validation = validateRegisterForm(form)
    setErrors(validation)
    if (hasErrors(validation)) {
      const firstInvalidField = Object.keys(validation)[0]
      document.getElementById(fieldId(firstInvalidField))?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      const email = form.email.trim().toLowerCase()
      const result = await register({
        nome: form.nome.trim().replace(/\s+/g, ' '),
        email,
        telefone: unmask(form.telefone) || undefined,
        orgaoPublico: form.orgaoPublico.trim(),
        senha: form.senha,
      })
      if (result.needsEmailConfirmation) {
        setConfirmationEmail(email)
      } else {
        onSuccess()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Não foi possível criar sua conta. Tente novamente.'
      if (message === EMAIL_ALREADY_REGISTERED_MESSAGE) {
        setErrors((prev) => ({ ...prev, email: message }))
        document.getElementById(fieldId('email'))?.focus()
      }
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    if (!confirmationEmail || isResending || resendCooldown > 0) return
    setIsResending(true)
    try {
      await resendConfirmationEmail(confirmationEmail)
      toast.success('E-mail de confirmação reenviado. Verifique sua caixa de entrada.')
      setResendCooldown(RESEND_COOLDOWN_SECONDS)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível reenviar o e-mail. Tente novamente.')
    } finally {
      setIsResending(false)
    }
  }

  if (confirmationEmail) {
    return (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand/10">
          <Mail className="size-7 text-brand" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-foreground">Verifique seu e-mail</h2>
          <p className="text-sm text-muted-foreground">
            Enviamos um link de confirmação para <span className="font-medium text-foreground">{confirmationEmail}</span>. Clique no
            link recebido para ativar sua conta.
          </p>
          <p className="text-xs text-muted-foreground">Caso não encontre a mensagem, verifique a caixa de spam ou lixo eletrônico.</p>
        </div>
        <Button type="button" variant="outline" onClick={handleResend} disabled={isResending || resendCooldown > 0}>
          {isResending
            ? 'Reenviando...'
            : resendCooldown > 0
              ? `Reenviar e-mail de confirmação (${resendCooldown}s)`
              : 'Reenviar e-mail de confirmação'}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <FormField label="Nome completo" error={errors.nome} required>
        <Input
          id={fieldId('nome')}
          value={form.nome}
          onChange={(event) => update('nome', event.target.value)}
          autoComplete="name"
          autoFocus
        />
      </FormField>

      <FormField label="Email" error={errors.email} required>
        <Input
          id={fieldId('email')}
          type="email"
          value={form.email}
          onChange={(event) => update('email', event.target.value)}
          autoComplete="email"
        />
      </FormField>

      <FormField label="Telefone ou celular" error={errors.telefone} hint={!errors.telefone ? 'Opcional' : undefined}>
        <MaskedInput
          id={fieldId('telefone')}
          mask={maskPhone}
          value={form.telefone}
          onChange={(value) => update('telefone', value)}
          placeholder="(00) 00000-0000"
          autoComplete="tel"
        />
      </FormField>

      <FormField label="Empresa / Órgão Público" error={errors.orgaoPublico} required>
        <Input
          id={fieldId('orgaoPublico')}
          value={form.orgaoPublico}
          onChange={(event) => update('orgaoPublico', event.target.value)}
          maxLength={150}
          autoComplete="organization"
          placeholder="Digite o nome da empresa ou órgão público"
        />
      </FormField>

      <FormField
        label="Senha"
        error={errors.senha}
        required
        hint={!errors.senha ? 'Mínimo de 8 caracteres, com letra e número.' : undefined}
      >
        <PasswordInput
          id={fieldId('senha')}
          value={form.senha}
          onChange={(event) => update('senha', event.target.value)}
          autoComplete="new-password"
        />
      </FormField>

      <FormField label="Confirmar senha" error={errors.confirmarSenha} required>
        <PasswordInput
          id={fieldId('confirmarSenha')}
          value={form.confirmarSenha}
          onChange={(event) => update('confirmarSenha', event.target.value)}
          autoComplete="new-password"
        />
      </FormField>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <Checkbox
            id={fieldId('aceitarTermos')}
            checked={form.aceitarTermos}
            onCheckedChange={(checked) => update('aceitarTermos', checked === true)}
            aria-invalid={Boolean(errors.aceitarTermos)}
            aria-describedby={errors.aceitarTermos ? fieldId('aceitarTermos-error') : undefined}
            className="mt-0.5"
          />
          <label htmlFor={fieldId('aceitarTermos')} className="text-sm text-muted-foreground">
            Li e concordo com os{' '}
            <Link to={ROUTES.termosDeUso} target="_blank" rel="noopener noreferrer" className="font-medium text-brand hover:underline">
              Termos de Uso
            </Link>{' '}
            e com a{' '}
            <Link
              to={ROUTES.politicaDePrivacidade}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand hover:underline"
            >
              Política de Privacidade
            </Link>{' '}
            da AquiAtas.
          </label>
        </div>
        {errors.aceitarTermos && (
          <p id={fieldId('aceitarTermos-error')} role="alert" className="text-xs font-medium text-destructive">
            {errors.aceitarTermos}
          </p>
        )}
      </div>

      <Button type="submit" disabled={busy} className="mt-1">
        {busy ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  )
}
