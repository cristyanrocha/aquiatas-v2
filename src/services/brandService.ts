import type { Brand } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { mapBrand, toDbId } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { slugify } from '@/utils/slugify'
import { createListStore } from './createStore'

async function list(): Promise<Brand[]> {
  const { data, error } = await supabase.from('brands').select('*').order('name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapBrand)
}

export const brandStore = createListStore(list)

export const brandService = {
  list,

  async create(nome: string): Promise<{ brand: Brand; alreadyExisted: boolean }> {
    const name = nome.trim()
    const { data: existing, error: findError } = await supabase.from('brands').select('*').ilike('name', name).maybeSingle()
    if (findError) throw new Error(translateSupabaseError(findError))
    if (existing) return { brand: mapBrand(existing), alreadyExisted: true }

    const { data, error } = await supabase.from('brands').insert({ name, slug: slugify(name) }).select().single()
    if (error) throw new Error(translateSupabaseError(error))
    // Awaited (not fire-and-forget): the caller selects this brand immediately after create()
    // resolves, so the list must already include it — otherwise the underlying native <select>
    // briefly has no matching <option>, which resets the just-applied selection to empty.
    await brandStore.refresh()
    return { brand: mapBrand(data), alreadyExisted: false }
  },

  async update(id: string, nome: string): Promise<Brand> {
    const { data, error } = await supabase
      .from('brands')
      .update({ name: nome, slug: slugify(nome) })
      .eq('id', toDbId(id))
      .select()
      .single()
    if (error) throw new Error(translateSupabaseError(error))
    void brandStore.refresh()
    return mapBrand(data)
  },

  async remove(id: string): Promise<void> {
    const { count, error: countError } = await supabase
      .from('atas')
      .select('id', { count: 'exact', head: true })
      .eq('brand_id', toDbId(id))
    if (countError) throw new Error(translateSupabaseError(countError))
    if ((count ?? 0) > 0) {
      throw new Error('Não é possível excluir esta marca porque ela está vinculada a um ou mais Itens das Atas.')
    }

    const { error } = await supabase.from('brands').delete().eq('id', toDbId(id))
    if (error) throw new Error(translateSupabaseError(error))
    void brandStore.refresh()
  },
}
