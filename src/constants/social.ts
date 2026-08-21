import type { PlanId } from '@/types'

export interface SocialLink {
  label: string
  href: string
  icon: 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'x'
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Instagram', href: 'https://instagram.com/aquiatas', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com/aquiatas', icon: 'facebook' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/aquiatas', icon: 'linkedin' },
  { label: 'TikTok', href: 'https://tiktok.com/@aquiatas', icon: 'tiktok' },
  { label: 'YouTube', href: 'https://youtube.com/@aquiatas', icon: 'youtube' },
  { label: 'X', href: 'https://x.com/aquiatas', icon: 'x' },
]

export const WHATSAPP_NUMBER = '5561981019364'
export const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Vim pelo site AquiAtas e gostaria de mais informações.'

export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/** WhatsApp messages for each plan's CTA button on the Preços page — one shared number, per-plan text. */
export const PLAN_WHATSAPP_MESSAGES: Record<PlanId, string> = {
  gratuito: 'Olá! Tenho interesse no plano Gratuito da AquiAtas.',
  lancamento: 'Olá! Tenho interesse no plano Lançamento da AquiAtas.',
  personalizado: 'Olá! Gostaria de falar sobre o plano Personalizado da AquiAtas.',
}
