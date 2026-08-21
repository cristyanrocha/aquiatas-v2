import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'

export const newsletterService = {
  async subscribe(email: string): Promise<void> {
    const { error } = await supabase.rpc('subscribe_newsletter', {
      p_email: email.trim().toLowerCase(),
      p_source: 'site',
    })
    if (error) throw new Error(translateSupabaseError(error))
  },

  async unsubscribe(email: string): Promise<void> {
    const { error } = await supabase.rpc('unsubscribe_newsletter', { p_email: email.trim().toLowerCase() })
    if (error) throw new Error(translateSupabaseError(error))
  },
}
