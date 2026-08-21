import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AdminFormHeader } from '@/components/admin'
import { FormField, Seo, toast } from '@/components/common'
import { categoryService } from '@/services/categoryService'
import { slugify } from '@/utils/slugify'
import { ROUTES } from '@/constants/routes'

export function CategoriaFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [errors, setErrors] = useState<{ nome?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)

  useEffect(() => {
    if (!id) return
    categoryService.getById(id).then((category) => {
      if (category) {
        setNome(category.nome)
      }
      setIsLoading(false)
    })
  }, [id])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!nome.trim()) {
      setErrors({ nome: 'Informe o nome da categoria.' })
      return
    }
    setErrors({})
    setIsSubmitting(true)
    try {
      if (isEditing && id) {
        await categoryService.update(id, { nome, slug: slugify(nome) })
        toast.success('Categoria atualizada com sucesso.')
      } else {
        await categoryService.create({ nome, slug: slugify(nome) })
        toast.success('Categoria criada com sucesso.')
      }
      navigate(ROUTES.adminCategorias)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Seo title={isEditing ? 'Editar categoria' : 'Nova categoria'} description="Formulário de categoria." path={ROUTES.adminCategorias} />
      <AdminFormHeader title={isEditing ? 'Editar categoria' : 'Nova categoria'} backHref={ROUTES.adminCategorias} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <FormField label="Nome" error={errors.nome} required hint={nome ? `Slug: ${slugify(nome)}` : undefined}>
          <Input value={nome} onChange={(event) => setNome(event.target.value)} />
        </FormField>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.adminCategorias)}>
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
