import type { LucideIcon } from 'lucide-react'
import type { Category } from '@/types'
import type { TablesUpdate } from '@/integrations/supabase/database.types'
import { supabase } from '@/integrations/supabase/client'
import { mapCategory, toDbId } from '@/lib/mappers'
import { translateSupabaseError } from '@/lib/supabaseErrors'
import { findIconOptionByComponent } from '@/constants/categoryIcons'
import { createListStore } from './createStore'

async function list(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('display_order').order('name')
  if (error) throw new Error(translateSupabaseError(error))
  return (data ?? []).map(mapCategory)
}

export const categoryStore = createListStore(list)

export interface CategoryInput {
  nome: string
  slug: string
  icon?: LucideIcon
}

export const categoryService = {
  list,

  async getById(id: string): Promise<Category | undefined> {
    const { data, error } = await supabase.from('categories').select('*').eq('id', toDbId(id)).maybeSingle()
    if (error) throw new Error(translateSupabaseError(error))
    return data ? mapCategory(data) : undefined
  },

  async create(input: CategoryInput): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: input.nome, slug: input.slug })
      .select()
      .single()
    if (error) throw new Error(translateSupabaseError(error))
    void categoryStore.refresh()
    return mapCategory(data)
  },

  async update(id: string, input: Partial<CategoryInput>): Promise<Category> {
    const payload: TablesUpdate<'categories'> = {}
    if (input.nome !== undefined) payload.name = input.nome
    if (input.slug !== undefined) payload.slug = input.slug
    if (input.icon !== undefined) payload.icon = findIconOptionByComponent(input.icon).id

    const { data, error } = await supabase.from('categories').update(payload).eq('id', toDbId(id)).select().single()
    if (error) throw new Error(translateSupabaseError(error))
    void categoryStore.refresh()
    return mapCategory(data)
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', toDbId(id))
    if (error) throw new Error(translateSupabaseError(error))
    void categoryStore.refresh()
  },
}
