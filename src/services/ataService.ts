import type { Ata, AtaDetail, AtaFilters, AtaSortOption, AtaWithRelations, PaginatedResult, PaginationState } from '@/types'
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/database.types'
import { supabase } from '@/integrations/supabase/client'
import {
  ADMIN_ATA_RELATIONS_SELECT,
  extractStoragePath,
  mapAdminAtaWithRelations,
  mapAta,
  mapAtaDetail,
  mapSearchAtaRow,
  toDbId,
  type AdminAtaRow,
} from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { slugify } from '@/utils/slugify'
import { createListStore } from './createStore'

async function list(): Promise<Ata[]> {
  const { data, error } = await supabase.from('atas').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapAta)
}

async function listWithRelationsAdmin(): Promise<AtaWithRelations[]> {
  const { data, error } = await supabase
    .from('atas')
    .select(ADMIN_ATA_RELATIONS_SELECT)
    .order('created_at', { ascending: false })
  if (error) throw new Error(translateSupabaseError(error))
  return ((data ?? []) as unknown as AdminAtaRow[]).map(mapAdminAtaWithRelations)
}

async function listPublicWithRelations(): Promise<AtaWithRelations[]> {
  const { data, error } = await supabase
    .from('public_atas')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapSearchAtaRow)
}

export const ataStore = createListStore(listWithRelationsAdmin)
export const publicAtaStore = createListStore(listPublicWithRelations)

export const EMPTY_ATA_FILTERS: AtaFilters = {
  search: '',
  categoriaIds: [],
  marcaIds: [],
  tipoIds: [],
  orgaoIds: [],
  situacoes: [],
}

const SITUATION_TO_DB: Record<string, string> = {
  vigente: 'active',
  proxima_vencimento: 'expiring',
  vencida: 'expired',
}

export type AtaInput = Omit<Ata, 'id' | 'createdAt' | 'updatedAt' | 'slug'>

function toDbPayload(input: Partial<AtaInput>) {
  const payload: TablesUpdate<'atas'> = {}
  if (input.descricao !== undefined) {
    payload.title = input.descricao
    payload.description = input.descricao
  }
  if (input.marcaId !== undefined) payload.brand_id = input.marcaId ? toDbId(input.marcaId) : null
  if (input.categoriaId !== undefined) payload.category_id = toDbId(input.categoriaId)
  if (input.tipoId !== undefined) payload.ata_type_id = toDbId(input.tipoId)
  if (input.orgaoId !== undefined) payload.agency_id = toDbId(input.orgaoId)
  if (input.partnerId !== undefined) payload.partner_id = toDbId(input.partnerId)
  if (input.numeroAta !== undefined) payload.reference_number = input.numeroAta || null
  if (input.numeroProcesso !== undefined) payload.process_number = input.numeroProcesso || null
  if (input.imagemUrl !== undefined) payload.image_path = extractStoragePath('ata-images', input.imagemUrl)
  if (input.dataVigenciaInicio !== undefined) payload.start_date = input.dataVigenciaInicio
  if (input.dataVigenciaFim !== undefined) payload.expiration_date = input.dataVigenciaFim
  if (input.quantidade !== undefined) {
    payload.registered_quantity = input.quantidade
    payload.available_quantity = input.quantidade
  }
  if (input.unidadeMedida !== undefined) payload.unit = input.unidadeMedida || null
  if (input.valorUnitario !== undefined) payload.unit_price = input.valorUnitario
  return payload
}

export const ataService = {
  list,
  listWithRelationsAdmin,
  listPublicWithRelations,

  async getById(id: string): Promise<Ata | undefined> {
    const { data, error } = await supabase.from('atas').select('*').eq('id', toDbId(id)).maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapAta(data) : undefined
  },

  async create(input: AtaInput): Promise<Ata> {
    const payload = toDbPayload(input)
    payload.slug = `${slugify(input.descricao)}-${Date.now()}`
    payload.publication_status = 'published'

    const { data, error } = await supabase.from('atas').insert(payload as TablesInsert<'atas'>).select().single()
    if (error) throw new Error(translateSupabaseError(error))
    void ataStore.refresh()
    void publicAtaStore.refresh()
    return mapAta(data)
  },

  async update(id: string, input: Partial<AtaInput>): Promise<Ata> {
    const { data, error } = await supabase.from('atas').update(toDbPayload(input)).eq('id', toDbId(id)).select().single()
    if (error) throw new Error(translateSupabaseError(error))
    void ataStore.refresh()
    void publicAtaStore.refresh()
    return mapAta(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('atas').delete().eq('id', toDbId(id))
    if (error) throw new Error(translateSupabaseError(error))
    void ataStore.refresh()
    void publicAtaStore.refresh()
  },

  async getBySlugWithRelations(slug: string): Promise<AtaDetail | undefined> {
    const { data, error } = await supabase.rpc('get_ata_details', { p_slug: slug })
    if (error) throw new Error(translateSupabaseError(error))
    const row = data?.[0]
    return row ? mapAtaDetail(row) : undefined
  },

  async incrementView(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_ata_view', { p_ata_id: toDbId(id) })
    if (error) return // best-effort — never block the page on a view-count failure
  },

  async search(
    filters: AtaFilters,
    sort: AtaSortOption,
    pagination: PaginationState,
  ): Promise<PaginatedResult<AtaWithRelations>> {
    const sortMap: Record<AtaSortOption, string> = {
      recentes: 'recent',
      validade: 'expiration',
      menor_valor: 'price_asc',
      maior_valor: 'price_desc',
      alfabetica: 'alphabetical',
    }

    const { data, error } = await supabase.rpc('search_public_atas', {
      p_search: filters.search || undefined,
      p_category_ids: filters.categoriaIds.length ? filters.categoriaIds.map(toDbId) : undefined,
      p_brand_ids: filters.marcaIds.length ? filters.marcaIds.map(toDbId) : undefined,
      p_ata_type_ids: filters.tipoIds.length ? filters.tipoIds.map(toDbId) : undefined,
      p_situation: filters.situacoes.length ? SITUATION_TO_DB[filters.situacoes[0]] : undefined,
      p_sort: sortMap[sort],
      p_page: pagination.page,
      p_page_size: pagination.pageSize,
    })
    if (error) throw new Error(translateSupabaseError(error))

    const rows = data ?? []
    const total = rows[0]?.total_count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize))

    return {
      items: rows.map(mapSearchAtaRow),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages,
    }
  },
}
