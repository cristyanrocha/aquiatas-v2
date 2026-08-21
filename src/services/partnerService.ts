import type { Partner } from '@/types'
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/database.types'
import { supabase } from '@/integrations/supabase/client'
import { extractStoragePath, mapPartner, toDbId } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { createListStore } from './createStore'

async function list(): Promise<Partner[]> {
  const { data, error } = await supabase.from('partners').select('*').order('trade_name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapPartner)
}

async function listPublic(): Promise<Partner[]> {
  const { data, error } = await supabase.from('public_partners').select('*').order('trade_name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapPartner)
}

export const partnerStore = createListStore(list)
export const publicPartnerStore = createListStore(listPublic)

export type PartnerInput = Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>

function toDbPayload(input: Partial<PartnerInput>) {
  const payload: TablesUpdate<'partners'> = {}
  if (input.nomeFantasia !== undefined) payload.trade_name = input.nomeFantasia
  if (input.razaoSocial !== undefined) payload.legal_name = input.razaoSocial
  if (input.cnpj !== undefined) payload.cnpj = input.cnpj
  if (input.contato !== undefined) payload.contact_name = input.contato || null
  if (input.descricao !== undefined) payload.description = input.descricao || null
  if (input.estado !== undefined) payload.state = input.estado || null
  if (input.cidade !== undefined) payload.city = input.cidade || null
  if (input.endereco !== undefined) payload.street = input.endereco || null
  if (input.cep !== undefined) payload.cep = input.cep || null
  if (input.telefone !== undefined) payload.phone = input.telefone || null
  if (input.whatsapp !== undefined) payload.whatsapp = input.whatsapp || null
  if (input.email !== undefined) payload.email = input.email || null
  if (input.website !== undefined) payload.website = input.website || null
  if (input.logoUrl !== undefined) payload.logo_path = extractStoragePath('partner-logos', input.logoUrl)
  return payload
}

export const partnerService = {
  list,
  listPublic,

  async getById(id: string): Promise<Partner | undefined> {
    const { data, error } = await supabase.from('partners').select('*').eq('id', toDbId(id)).maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapPartner(data) : undefined
  },

  async create(input: PartnerInput): Promise<Partner> {
    const { data, error } = await supabase
      .from('partners')
      .insert(toDbPayload(input) as TablesInsert<'partners'>)
      .select()
      .single()
    if (error) throw new Error(translateSupabaseError(error))
    void partnerStore.refresh()
    void publicPartnerStore.refresh()
    return mapPartner(data)
  },

  async update(id: string, input: Partial<PartnerInput>): Promise<Partner> {
    const { data, error } = await supabase.from('partners').update(toDbPayload(input)).eq('id', toDbId(id)).select().single()
    if (error) throw new Error(translateSupabaseError(error))
    void partnerStore.refresh()
    void publicPartnerStore.refresh()
    return mapPartner(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('partners').delete().eq('id', toDbId(id))
    if (error) throw new Error(translateSupabaseError(error))
    void partnerStore.refresh()
    void publicPartnerStore.refresh()
  },
}
