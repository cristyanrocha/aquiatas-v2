import type { AtaType } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { mapAtaType, toDbId } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { slugify } from '@/utils/slugify'
import { createListStore } from './createStore'

async function list(): Promise<AtaType[]> {
  const { data, error } = await supabase.from('ata_types').select('*').order('name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapAtaType)
}

export const ataTypeStore = createListStore(list)

export const ataTypeService = {
  list,

  async getById(id: string): Promise<AtaType | undefined> {
    const { data, error } = await supabase.from('ata_types').select('*').eq('id', toDbId(id)).maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapAtaType(data) : undefined
  },

  async create(input: { nome: string }): Promise<AtaType> {
    const { data, error } = await supabase
      .from('ata_types')
      .insert({ name: input.nome, slug: slugify(input.nome) })
      .select()
      .single()
    if (error) throw new Error(translateSupabaseError(error))
    void ataTypeStore.refresh()
    return mapAtaType(data)
  },

  async update(id: string, input: { nome: string }): Promise<AtaType> {
    const { data, error } = await supabase
      .from('ata_types')
      .update({ name: input.nome, slug: slugify(input.nome) })
      .eq('id', toDbId(id))
      .select()
      .single()
    if (error) throw new Error(translateSupabaseError(error))
    void ataTypeStore.refresh()
    return mapAtaType(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('ata_types').delete().eq('id', toDbId(id))
    if (error) throw new Error(translateSupabaseError(error))
    void ataTypeStore.refresh()
  },
}
