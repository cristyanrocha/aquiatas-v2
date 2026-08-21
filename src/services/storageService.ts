import { supabase } from '@/integrations/supabase/client'
import { translateSupabaseError } from '@/lib/supabaseErrors'

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

function sanitizeFileName(name: string): string {
  const lastDot = name.lastIndexOf('.')
  const ext = lastDot >= 0 ? name.slice(lastDot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : 'jpg'
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || 'jpg'}`
}

export const storageService = {
  /** Uploads an image to a public bucket under an optional folder and returns its public URL. */
  async uploadImage(bucket: string, file: File, folder?: string): Promise<string> {
    if (!file.type.startsWith('image/')) throw new Error('Selecione um arquivo de imagem (PNG ou JPG).')
    if (file.size > MAX_IMAGE_BYTES) throw new Error('A imagem deve ter no máximo 5MB.')

    const path = folder ? `${folder}/${sanitizeFileName(file.name)}` : sanitizeFileName(file.name)
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) throw new Error(translateSupabaseError(error))

    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
  },

  /** Uploads the current user's avatar under the required avatars/{authUserId}/ path and returns its storage path (not the URL). */
  async uploadAvatar(authUserId: string, file: File): Promise<string> {
    if (!file.type.startsWith('image/')) throw new Error('Selecione um arquivo de imagem (PNG ou JPG).')
    if (file.size > MAX_IMAGE_BYTES) throw new Error('A imagem deve ter no máximo 5MB.')

    const path = `${authUserId}/${sanitizeFileName(file.name)}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) throw new Error(translateSupabaseError(error))
    return path
  },

  async uploadDocument(file: File, folder?: string): Promise<string> {
    if (file.type !== 'application/pdf') throw new Error('Selecione um arquivo PDF.')
    if (file.size > 20 * 1024 * 1024) throw new Error('O documento deve ter no máximo 20MB.')

    const path = folder ? `${folder}/${sanitizeFileName(file.name)}` : sanitizeFileName(file.name)
    const { error } = await supabase.storage.from('ata-documents').upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) throw new Error(translateSupabaseError(error))
    return path
  },
}
