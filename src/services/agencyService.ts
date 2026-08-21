import type { Agency } from '@/types'
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/database.types'
import { supabase } from '@/integrations/supabase/client'
import { extractStoragePath, mapAgency, toDbId } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { createListStore } from './createStore'

async function list(): Promise<Agency[]> {
  const { data, error } = await supabase.from('agencies').select('*').order('name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapAgency)
}

async function listPublic(): Promise<Agency[]> {
  const { data, error } = await supabase.from('public_agencies').select('*').order('name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapAgency)
}

export const agencyStore = createListStore(list)
export const publicAgencyStore = createListStore(listPublic)

export type AgencyInput = Omit<Agency, 'id' | 'createdAt' | 'updatedAt'>

function toDbPayload(input: Partial<AgencyInput>) {
  const payload: TablesUpdate<'agencies'> = {}
  if (input.nome !== undefined) payload.name = input.nome
  if (input.sigla !== undefined) payload.acronym = input.sigla || null
  if (input.esfera !== undefined) payload.government_sphere = input.esfera
  if (input.estado !== undefined) payload.state = input.estado || null
  if (input.cidade !== undefined) payload.city = input.cidade || null
  if (input.logoUrl !== undefined) payload.logo_path = extractStoragePath('agency-logos', input.logoUrl)
  return payload
}

export const agencyService = {
  list,
  listPublic,

  async getById(id: string): Promise<Agency | undefined> {
    const { data, error } = await supabase.from('agencies').select('*').eq('id', toDbId(id)).maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapAgency(data) : undefined
  },

  async create(input: AgencyInput): Promise<Agency> {
    const { data, error } = await supabase
      .from('agencies')
      .insert(toDbPayload(input) as TablesInsert<'agencies'>)
      .select()
      .single()
    if (error) throw new Error(translateSupabaseError(error))
    void agencyStore.refresh()
    void publicAgencyStore.refresh()
    return mapAgency(data)
  },

  async update(id: string, input: Partial<AgencyInput>): Promise<Agency> {
    const { data, error } = await supabase.from('agencies').update(toDbPayload(input)).eq('id', toDbId(id)).select().single()
    if (error) throw new Error(translateSupabaseError(error))
    void agencyStore.refresh()
    void publicAgencyStore.refresh()
    return mapAgency(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('agencies').delete().eq('id', toDbId(id))
    if (error) throw new Error(translateSupabaseError(error))
    void agencyStore.refresh()
    void publicAgencyStore.refresh()
  },
}
