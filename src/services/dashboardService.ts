import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'

export interface DashboardLatestAta {
  id: number
  title: string
  slug: string
  agency_name: string
  unit_price: number
  expiration_date: string
  publication_status: string
  situation: 'active' | 'expiring' | 'expired'
}

export interface DashboardGroupCount {
  category_name?: string
  ata_type_name?: string
  total: number
}

export interface DashboardSummary {
  total_atas: number
  total_partners: number
  total_agencies: number
  total_users: number
  total_categories: number
  atas_active: number
  atas_expiring: number
  atas_expired: number
  atas_draft: number
  latest_atas: DashboardLatestAta[]
  atas_by_category: DashboardGroupCount[]
  atas_by_type: DashboardGroupCount[]
}

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data, error } = await supabase.rpc('get_dashboard_summary')
    if (error) throw new Error(translateSupabaseError(error))
    return data as unknown as DashboardSummary
  },
}
