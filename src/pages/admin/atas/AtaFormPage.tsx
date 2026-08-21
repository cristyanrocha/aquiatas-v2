import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AdminFormHeader, AdminFormSection } from '@/components/admin'
import { FormField, Seo, UploadPreview, toast } from '@/components/common'
import { Combobox } from '@/components/forms'
import { useEntityStore } from '@/hooks/useEntityStore'
import { categoryStore } from '@/services/categoryService'
import { ataTypeStore } from '@/services/ataTypeService'
import { agencyStore } from '@/services/agencyService'
import { partnerStore } from '@/services/partnerService'
import { brandStore, brandService } from '@/services/brandService'
import { ataService } from '@/services/ataService'
import { placeholderImage } from '@/constants/images'
import { fromDateInputValue, toDateInputValue } from '@/utils/format'
import { ROUTES } from '@/constants/routes'

interface FormState {
  descricao: string
  marcaId: string
  categoriaId: string
  tipoId: string
  orgaoId: string
  partnerId: string
  numeroAta: string
  numeroProcesso: string
  imagemUrl: string | null
  dataVigenciaInicio: string
  dataVigenciaFim: string
  quantidade: string
  unidadeMedida: string
  valorUnitario: string
}

const today = new Date().toISOString()

const INITIAL_STATE: FormState = {
  descricao: '',
  marcaId: '',
  categoriaId: '',
  tipoId: '',
  orgaoId: '',
  partnerId: '',
  numeroAta: '',
  numeroProcesso: '',
  imagemUrl: null,
  dataVigenciaInicio: today,
  dataVigenciaFim: today,
  quantidade: '',
  unidadeMedida: 'unidades',
  valorUnitario: '',
}

export function AtaFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: categories } = useEntityStore(categoryStore)
  const { data: ataTypes } = useEntityStore(ataTypeStore)
  const { data: agencies } = useEntityStore(agencyStore)
  const { data: partners } = useEntityStore(partnerStore)
  const { data: brands } = useEntityStore(brandStore)
  const sortedBrands = [...brands].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
  const agencyOptions = agencies.map((agency) => ({ id: agency.id, label: agency.nome.trim() }))

  const [form, setForm] = useState<FormState>(INITIAL_STATE)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(isEditing)
  const [showNewBrand, setShowNewBrand] = useState(false)
  const [newBrandName, setNewBrandName] = useState('')
  const [isAddingBrand, setIsAddingBrand] = useState(false)

  useEffect(() => {
    if (!id) return
    ataService.getById(id).then((ata) => {
      if (ata) {
        setForm({
          descricao: ata.descricao,
          marcaId: ata.marcaId,
          categoriaId: ata.categoriaId,
          tipoId: ata.tipoId,
          orgaoId: ata.orgaoId,
          partnerId: ata.partnerId,
          numeroAta: ata.numeroAta,
          numeroProcesso: ata.numeroProcesso,
          imagemUrl: ata.imagemUrl,
          dataVigenciaInicio: ata.dataVigenciaInicio,
          dataVigenciaFim: ata.dataVigenciaFim,
          quantidade: String(ata.quantidade),
          unidadeMedida: ata.unidadeMedida,
          valorUnitario: String(ata.valorUnitario),
        })
      }
      setIsLoading(false)
    })
  }, [id])

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleAddBrand() {
    const name = newBrandName.trim()
    if (!name || isAddingBrand) return
    setIsAddingBrand(true)
    try {
      const { brand, alreadyExisted } = await brandService.create(name)
      update('marcaId', brand.id)
      setNewBrandName('')
      setShowNewBrand(false)
      toast.success(alreadyExisted ? 'Esta marca já está cadastrada e foi selecionada.' : 'Marca cadastrada com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível cadastrar a marca. Tente novamente.')
    } finally {
      setIsAddingBrand(false)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.descricao.trim()) nextErrors.descricao = 'Informe a descrição.'
    if (!form.marcaId) nextErrors.marcaId = 'Selecione a marca.'
    if (!form.categoriaId) nextErrors.categoriaId = 'Selecione a categoria.'
    if (!form.tipoId) nextErrors.tipoId = 'Selecione o tipo.'
    if (!form.orgaoId) nextErrors.orgaoId = 'Selecione o órgão.'
    if (!form.partnerId) nextErrors.partnerId = 'Selecione o parceiro.'
    if (!form.numeroAta.trim()) nextErrors.numeroAta = 'Informe o pregão.'
    if (!form.quantidade || Number(form.quantidade) <= 0) nextErrors.quantidade = 'Informe uma quantidade válida.'
    if (!form.valorUnitario || Number(form.valorUnitario) <= 0) nextErrors.valorUnitario = 'Informe um valor válido.'
    if (form.dataVigenciaFim < form.dataVigenciaInicio) nextErrors.dataVigenciaFim = 'A data final deve ser após a inicial.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    const payload = {
      descricao: form.descricao,
      marcaId: form.marcaId,
      categoriaId: form.categoriaId,
      tipoId: form.tipoId,
      orgaoId: form.orgaoId,
      partnerId: form.partnerId,
      numeroAta: form.numeroAta,
      numeroProcesso: form.numeroProcesso,
      imagemUrl: form.imagemUrl ?? placeholderImage(form.descricao, 640, 480),
      dataVigenciaInicio: form.dataVigenciaInicio,
      dataVigenciaFim: form.dataVigenciaFim,
      quantidade: Number(form.quantidade),
      unidadeMedida: form.unidadeMedida,
      valorUnitario: Number(form.valorUnitario),
    }
    try {
      if (isEditing && id) {
        await ataService.update(id, payload)
        toast.success('Ata atualizada com sucesso.')
      } else {
        await ataService.create(payload)
        toast.success('Ata cadastrada com sucesso!')
      }
      navigate(ROUTES.adminAtas)
    } catch (error) {
      const fallback = isEditing
        ? 'Não foi possível atualizar a Ata. Verifique os dados e tente novamente.'
        : 'Não foi possível cadastrar a Ata. Verifique os dados e tente novamente.'
      toast.error(error instanceof Error ? error.message : fallback)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando...</p>
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Seo title={isEditing ? 'Editar ata' : 'Nova ata'} description="Formulário de ata." path={ROUTES.adminAtas} />
      <AdminFormHeader title={isEditing ? 'Editar ata' : 'Nova ata'} backHref={ROUTES.adminAtas} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 lg:p-8">
        <AdminFormSection title="Produto">
          <UploadPreview value={form.imagemUrl} onChange={(value) => update('imagemUrl', value)} bucket="ata-images" label="Imagem" />

          <FormField label="Descrição" error={errors.descricao} required>
            <Textarea rows={2} value={form.descricao} onChange={(event) => update('descricao', event.target.value)} />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Marca" error={errors.marcaId} required>
              <div>
                <div className="flex gap-2">
                  <Select value={form.marcaId} onValueChange={(value) => update('marcaId', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowNewBrand((prev) => !prev)} aria-label="Adicionar marca">
                    <Plus className="size-4" />
                  </Button>
                </div>
                {showNewBrand && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={newBrandName}
                      onChange={(event) => setNewBrandName(event.target.value)}
                      placeholder="Nome da nova marca"
                      disabled={isAddingBrand}
                    />
                    <Button type="button" size="sm" disabled={isAddingBrand} onClick={handleAddBrand}>
                      {isAddingBrand ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                  </div>
                )}
              </div>
            </FormField>
            <FormField label="Categoria" error={errors.categoriaId} required>
              <Select value={form.categoriaId} onValueChange={(value) => update('categoriaId', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
        </AdminFormSection>

        <Separator />

        <AdminFormSection title="Ata / Processo">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Pregão" error={errors.numeroAta} required>
              <Input value={form.numeroAta} onChange={(event) => update('numeroAta', event.target.value)} placeholder="000/0000" />
            </FormField>
            <FormField label="Número do Processo">
              <Input value={form.numeroProcesso} onChange={(event) => update('numeroProcesso', event.target.value)} />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Órgão" error={errors.orgaoId} required>
              <Combobox
                value={form.orgaoId}
                onChange={(value) => update('orgaoId', value)}
                options={agencyOptions}
                placeholder="Selecione"
                searchPlaceholder="Pesquisar órgão..."
                emptyMessage="Nenhum órgão encontrado."
              />
            </FormField>
            <FormField label="Tipo de Ata" error={errors.tipoId} required>
              <Select value={form.tipoId} onValueChange={(value) => update('tipoId', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ataTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Vigência - início" required>
              <Input
                type="date"
                value={toDateInputValue(form.dataVigenciaInicio)}
                onChange={(event) => update('dataVigenciaInicio', fromDateInputValue(event.target.value))}
              />
            </FormField>
            <FormField label="Vigência - fim" error={errors.dataVigenciaFim} required>
              <Input
                type="date"
                value={toDateInputValue(form.dataVigenciaFim)}
                onChange={(event) => update('dataVigenciaFim', fromDateInputValue(event.target.value))}
              />
            </FormField>
          </div>
        </AdminFormSection>

        <Separator />

        <AdminFormSection title="Registro">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Quantidade" error={errors.quantidade} required>
              <Input type="number" min="0" value={form.quantidade} onChange={(event) => update('quantidade', event.target.value)} />
            </FormField>
            <FormField label="Unidade de medida" required>
              <Input value={form.unidadeMedida} onChange={(event) => update('unidadeMedida', event.target.value)} />
            </FormField>
            <FormField label="Valor unitário (R$)" error={errors.valorUnitario} required>
              <Input type="number" min="0" step="0.01" value={form.valorUnitario} onChange={(event) => update('valorUnitario', event.target.value)} />
            </FormField>
          </div>
        </AdminFormSection>

        <Separator />

        <AdminFormSection title="Parceiro">
          <FormField label="Parceiro responsável" error={errors.partnerId} required>
            <Select value={form.partnerId} onValueChange={(value) => update('partnerId', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.nomeFantasia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </AdminFormSection>

        <div className="flex justify-end gap-2 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.adminAtas)}>
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
