import type { ContactFormData } from '@/types'
import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'

export const contactService = {
  async submit(data: ContactFormData): Promise<void> {
    const { error } = await supabase.from('contact_messages').insert({
      name: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.telefone.trim() || null,
      subject: data.assunto.trim(),
      message: data.mensagem.trim(),
    })
    if (error) throw new Error(translateSupabaseError(error))
  },
}
