import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'

export interface PublicStats {
  atas: number
  orgaos: number
  estados: number
}

export const statsService = {
  /** Two lightweight queries (one HEAD count, one count+single-column) — no new backend objects. */
  async getPublicStats(): Promise<PublicStats> {
    const [atasResult, agenciesResult] = await Promise.all([
      supabase.from('public_atas').select('*', { count: 'exact', head: true }),
      supabase.from('public_agencies').select('state', { count: 'exact' }),
    ])
    if (atasResult.error) throw new Error(translateSupabaseError(atasResult.error))
    if (agenciesResult.error) throw new Error(translateSupabaseError(agenciesResult.error))

    const estados = new Set((agenciesResult.data ?? []).map((row) => row.state).filter(Boolean)).size

    return {
      atas: atasResult.count ?? 0,
      orgaos: agenciesResult.count ?? 0,
      estados,
    }
  },
}
