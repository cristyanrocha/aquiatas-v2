import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AdminFormHeader } from '@/components/admin'
import { FormField, Seo, toast } from '@/components/common'
import { MaskedInput } from '@/components/forms'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'
import { maskPhone, unmask } from '@/utils/masks'
import { ROLE_LABELS } from '@/utils/permissions'
import { isValidEmail, validateOrgaoPublico } from '@/utils/validation'
import { ROUTES } from '@/constants/routes'
import type { User, UserRole } from '@/types'

const ASSIGNABLE_ROLES: UserRole[] = ['usuario', 'gestor', 'administrador']

interface FormState {
  nome: string
  email: string
  telefone: string
  orgaoPublico: string
  role: UserRole
  ativo: boolean
}

const INITIAL_STATE: FormState = { nome: '', email: '', telefone: '', orgaoPublico: '', role: 'usuario', ativo: true }

export function UsuarioFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isSelf = isEditing && id === currentUser?.id

  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [originalEmail, setOriginalEmail] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    userService.getById(id).then((user: User | undefined) => {
      if (user) {
        setForm({
          nome: user.nome,
          email: user.email,
          telefone: user.telefone ?? '',
          orgaoPublico: user.orgaoPublico,
          role: user.role,
          ativo: user.ativo,
        })
        setOriginalEmail(user.email)
      }
      setIsLoading(false)
    })
  }, [id])

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.nome.trim()) nextErrors.nome = 'Informe o nome.'
    if (!isValidEmail(form.email)) nextErrors.email = 'Informe um email válido.'
    const orgaoPublicoError = validateOrgaoPublico(form.orgaoPublico)
    if (orgaoPublicoError) nextErrors.orgaoPublico = orgaoPublicoError
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await userService.update(id, {
          nome: form.nome,
          telefone: unmask(form.telefone) || undefined,
          orgaoPublico: form.orgaoPublico.trim(),
          role: isSelf ? undefined : form.role,
        })
        if (!isSelf && form.email.trim().toLowerCase() !== originalEmail.toLowerCase()) {
          await userService.updateEmail(id, form.email)
        }
        if (!isSelf) {
          await userService.setStatus(id, form.ativo ? 'active' : 'inactive')
        }
        toast.success('Usuário atualizado com sucesso.')
      } else {
        await userService.create({
          nome: form.nome,
          email: form.email.trim().toLowerCase(),
          telefone: unmask(form.telefone) || undefined,
          orgaoPublico: form.orgaoPublico.trim(),
          role: form.role,
        })
        toast.success('Convite enviado! O usuário receberá um email para definir a senha e ativar a conta.')
      }
      navigate(ROUTES.adminUsuarios)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível salvar o usuário.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSendPasswordReset() {
    if (!id) return
    setIsSendingReset(true)
    try {
      await userService.sendPasswordReset(id)
      toast.success('Email de redefinição de senha enviado.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível enviar o email de redefinição.')
    } finally {
      setIsSendingReset(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Seo title={isEditing ? 'Editar usuário' : 'Novo usuário'} description="Formulário de usuário." path={ROUTES.adminUsuarios} />
      <AdminFormHeader title={isEditing ? 'Editar usuário' : 'Novo usuário'} backHref={ROUTES.adminUsuarios} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <FormField label="Nome" error={errors.nome} required>
          <Input value={form.nome} onChange={(event) => update('nome', event.target.value)} />
        </FormField>
        <FormField
          label="Email"
          error={errors.email}
          required
          hint={isSelf ? 'Você não pode alterar o email da própria conta por aqui.' : undefined}
        >
          <Input
            type="email"
            value={form.email}
            disabled={isSelf}
            onChange={(event) => update('email', event.target.value)}
          />
        </FormField>
        <FormField label="Telefone" hint="Opcional">
          <MaskedInput mask={maskPhone} value={form.telefone} onChange={(value) => update('telefone', value)} placeholder="(00) 00000-0000" />
        </FormField>
        <FormField label="Empresa / Órgão Público" error={errors.orgaoPublico} required>
          <Input
            value={form.orgaoPublico}
            onChange={(event) => update('orgaoPublico', event.target.value)}
            maxLength={150}
            placeholder="Digite o nome da empresa ou órgão público"
          />
        </FormField>

        {!isEditing && (
          <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            Um convite será enviado por email para que o usuário defina a própria senha.
          </p>
        )}

        {isEditing && (
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Senha</p>
              <p className="text-xs text-muted-foreground">Envie um email para o usuário redefinir a própria senha.</p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={isSendingReset} onClick={handleSendPasswordReset}>
              {isSendingReset ? 'Enviando...' : 'Enviar redefinição'}
            </Button>
          </div>
        )}

        <FormField label="Perfil" required hint={isSelf ? 'Você não pode alterar o próprio papel.' : undefined}>
          <Select value={form.role} onValueChange={(value) => update('role', value as UserRole)} disabled={isSelf}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSIGNABLE_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {isEditing && (
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <Label htmlFor="usuario-ativo">Usuário ativo</Label>
              <p className="text-xs text-muted-foreground">Usuários inativos não podem acessar a plataforma.</p>
            </div>
            <Switch
              id="usuario-ativo"
              checked={form.ativo}
              disabled={isSelf}
              onCheckedChange={(checked) => update('ativo', checked)}
            />
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.adminUsuarios)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  )
}
