import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AdminFormHeader } from '@/components/admin'
import { FormField, Seo, UploadPreview, toast } from '@/components/common'
import { MaskedInput } from '@/components/forms'
import { partnerService } from '@/services/partnerService'
import { maskCEP, maskCNPJ, maskPhone, unmask } from '@/utils/masks'
import { placeholderImage } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import type { Partner } from '@/types'

type FormState = Omit<Partner, 'id' | 'createdAt' | 'updatedAt' | 'logoUrl'> & { logoUrl: string | null }

const INITIAL_STATE: FormState = {
  nomeFantasia: '',
  razaoSocial: '',
  cnpj: '',
  contato: '',
  descricao: '',
  estado: '',
  cidade: '',
  endereco: '',
  cep: '',
  telefone: '',
  whatsapp: '',
  email: '',
  website: '',
  logoUrl: null,
}

export function ParceiroFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    partnerService.getById(id).then((partner) => {
      if (partner) {
        setForm({
          nomeFantasia: partner.nomeFantasia,
          razaoSocial: partner.razaoSocial,
          cnpj: partner.cnpj,
          contato: partner.contato,
          descricao: partner.descricao,
          estado: partner.estado,
          cidade: partner.cidade,
          endereco: partner.endereco,
          cep: partner.cep,
          telefone: partner.telefone,
          whatsapp: partner.whatsapp,
          email: partner.email,
          website: partner.website ?? '',
          logoUrl: partner.logoUrl,
        })
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
    if (!form.nomeFantasia.trim()) nextErrors.nomeFantasia = 'Informe o nome fantasia.'
    if (!form.razaoSocial.trim()) nextErrors.razaoSocial = 'Informe a razão social.'
    if (!form.contato.trim()) nextErrors.contato = 'Informe o nome do contato.'
    if (unmask(form.cnpj).length !== 14) nextErrors.cnpj = 'CNPJ inválido.'
    if (!form.estado.trim()) nextErrors.estado = 'Informe o estado (UF).'
    if (!form.cidade.trim()) nextErrors.cidade = 'Informe a cidade.'
    if (!form.email.trim()) nextErrors.email = 'Informe o email.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    const payload = {
      ...form,
      cnpj: unmask(form.cnpj),
      cep: unmask(form.cep),
      telefone: unmask(form.telefone),
      whatsapp: unmask(form.whatsapp),
      estado: form.estado.toUpperCase(),
      website: form.website || undefined,
      logoUrl: form.logoUrl ?? placeholderImage(form.nomeFantasia, 200, 200),
    }
    try {
      if (isEditing && id) {
        await partnerService.update(id, payload)
        toast.success('Parceiro atualizado com sucesso.')
      } else {
        await partnerService.create(payload)
        toast.success('Parceiro criado com sucesso.')
      }
      navigate(ROUTES.adminParceiros)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Seo title={isEditing ? 'Editar parceiro' : 'Novo parceiro'} description="Formulário de parceiro." path={ROUTES.adminParceiros} />
      <AdminFormHeader title={isEditing ? 'Editar parceiro' : 'Novo parceiro'} backHref={ROUTES.adminParceiros} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <UploadPreview value={form.logoUrl} onChange={(value) => update('logoUrl', value)} bucket="partner-logos" label="Logo" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nome fantasia" error={errors.nomeFantasia} required>
            <Input value={form.nomeFantasia} onChange={(event) => update('nomeFantasia', event.target.value)} />
          </FormField>
          <FormField label="Razão social" error={errors.razaoSocial} required>
            <Input value={form.razaoSocial} onChange={(event) => update('razaoSocial', event.target.value)} />
          </FormField>
        </div>

        <FormField label="Descrição">
          <Textarea rows={3} value={form.descricao} onChange={(event) => update('descricao', event.target.value)} />
        </FormField>

        <FormField label="Contato" error={errors.contato} required hint="Nome da pessoa responsável pelo atendimento.">
          <Input value={form.contato} onChange={(event) => update('contato', event.target.value)} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="CNPJ" error={errors.cnpj} required>
            <MaskedInput mask={maskCNPJ} value={form.cnpj} onChange={(value) => update('cnpj', value)} placeholder="00.000.000/0000-00" />
          </FormField>
          <FormField label="CEP">
            <MaskedInput mask={maskCEP} value={form.cep} onChange={(value) => update('cep', value)} placeholder="00000-000" />
          </FormField>
        </div>

        <FormField label="Endereço">
          <Input value={form.endereco} onChange={(event) => update('endereco', event.target.value)} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Estado (UF)" error={errors.estado} required>
            <Input value={form.estado} maxLength={2} onChange={(event) => update('estado', event.target.value.toUpperCase())} />
          </FormField>
          <FormField label="Cidade" error={errors.cidade} required>
            <Input value={form.cidade} onChange={(event) => update('cidade', event.target.value)} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Telefone">
            <MaskedInput mask={maskPhone} value={form.telefone} onChange={(value) => update('telefone', value)} placeholder="(00) 0000-0000" />
          </FormField>
          <FormField label="WhatsApp">
            <MaskedInput mask={maskPhone} value={form.whatsapp} onChange={(value) => update('whatsapp', value)} placeholder="(00) 00000-0000" />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Email" error={errors.email} required>
            <Input type="email" value={form.email} onChange={(event) => update('email', event.target.value)} />
          </FormField>
          <FormField label="Website">
            <Input value={form.website} onChange={(event) => update('website', event.target.value)} placeholder="https://" />
          </FormField>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.adminParceiros)}>
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
