import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminFormHeader } from '@/components/admin'
import { FormField, Seo, UploadPreview, toast } from '@/components/common'
import { agencyService } from '@/services/agencyService'
import { placeholderImage } from '@/constants/images'
import { ROUTES } from '@/constants/routes'
import type { Agency } from '@/types'

const ESFERAS: Agency['esfera'][] = ['Distrital', 'Empresa Estatal', 'Estadual', 'Federal', 'Municipal', 'Sistema S']

interface FormState {
  nome: string
  sigla: string
  esfera: Agency['esfera']
  estado: string
  cidade: string
  logoUrl: string | null
}

const INITIAL_STATE: FormState = { nome: '', sigla: '', esfera: 'Municipal', estado: '', cidade: '', logoUrl: null }

export function OrgaoFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    agencyService.getById(id).then((agency) => {
      if (agency) {
        setForm({
          nome: agency.nome,
          sigla: agency.sigla,
          esfera: agency.esfera,
          estado: agency.estado,
          cidade: agency.cidade,
          logoUrl: agency.logoUrl,
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
    if (!form.nome.trim()) nextErrors.nome = 'Informe o nome do órgão.'
    if (!form.sigla.trim()) nextErrors.sigla = 'Informe a sigla.'
    if (!form.estado.trim()) nextErrors.estado = 'Informe o estado (UF).'
    if (!form.cidade.trim()) nextErrors.cidade = 'Informe a cidade.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    const payload = {
      nome: form.nome,
      sigla: form.sigla,
      esfera: form.esfera,
      estado: form.estado.toUpperCase(),
      cidade: form.cidade,
      logoUrl: form.logoUrl ?? placeholderImage(form.sigla || form.nome, 200, 200),
    }
    try {
      if (isEditing && id) {
        await agencyService.update(id, payload)
        toast.success('Órgão atualizado com sucesso.')
      } else {
        await agencyService.create(payload)
        toast.success('Órgão criado com sucesso.')
      }
      navigate(ROUTES.adminOrgaos)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Seo title={isEditing ? 'Editar órgão' : 'Novo órgão'} description="Formulário de órgão público." path={ROUTES.adminOrgaos} />
      <AdminFormHeader title={isEditing ? 'Editar órgão' : 'Novo órgão'} backHref={ROUTES.adminOrgaos} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <UploadPreview value={form.logoUrl} onChange={(value) => update('logoUrl', value)} bucket="agency-logos" label="Logo" />

        <FormField label="Nome" error={errors.nome} required>
          <Input value={form.nome} onChange={(event) => update('nome', event.target.value)} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Sigla" error={errors.sigla} required>
            <Input value={form.sigla} onChange={(event) => update('sigla', event.target.value)} />
          </FormField>
          <FormField label="Esfera" required>
            <Select value={form.esfera} onValueChange={(value) => update('esfera', value as Agency['esfera'])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ESFERAS.map((esfera) => (
                  <SelectItem key={esfera} value={esfera}>
                    {esfera}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Estado (UF)" error={errors.estado} required>
            <Input value={form.estado} maxLength={2} onChange={(event) => update('estado', event.target.value.toUpperCase())} />
          </FormField>
          <FormField label="Cidade" error={errors.cidade} required>
            <Input value={form.cidade} onChange={(event) => update('cidade', event.target.value)} />
          </FormField>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.adminOrgaos)}>
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
