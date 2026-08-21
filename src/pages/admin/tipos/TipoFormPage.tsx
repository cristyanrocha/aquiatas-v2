import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AdminFormHeader } from '@/components/admin'
import { FormField, Seo, toast } from '@/components/common'
import { ataTypeService } from '@/services/ataTypeService'
import { ROUTES } from '@/constants/routes'

export function TipoFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    ataTypeService.getById(id).then((type) => {
      if (type) setNome(type.nome)
      setIsLoading(false)
    })
  }, [id])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!nome.trim()) {
      setError('Informe o nome do tipo de ata.')
      return
    }
    setError(undefined)
    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await ataTypeService.update(id, { nome })
        toast.success('Tipo de ata atualizado com sucesso.')
      } else {
        await ataTypeService.create({ nome })
        toast.success('Tipo de ata criado com sucesso.')
      }
      navigate(ROUTES.adminTipos)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Seo title={isEditing ? 'Editar tipo de ata' : 'Novo tipo de ata'} description="Formulário de tipo de ata." path={ROUTES.adminTipos} />
      <AdminFormHeader title={isEditing ? 'Editar tipo de ata' : 'Novo tipo de ata'} backHref={ROUTES.adminTipos} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <FormField label="Nome" error={error} required>
          <Input value={nome} onChange={(event) => setNome(event.target.value)} />
        </FormField>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.adminTipos)}>
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
