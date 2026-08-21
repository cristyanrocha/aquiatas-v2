import { ShieldCheck, Sparkles, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface BrandValue {
  icon: LucideIcon
  title: string
  description: string
}

/** AquiAtas' three core value propositions — shared between Quem Somos and the Home page. */
export const BRAND_VALUES: BrandValue[] = [
  { icon: ShieldCheck, title: 'Transparência', description: 'Informações claras e acessíveis sobre atas e fornecedores.' },
  { icon: Sparkles, title: 'Simplicidade', description: 'Tecnologia que facilita, sem burocracia desnecessária.' },
  { icon: Target, title: 'Eficiência', description: 'Conectamos oferta e demanda do setor público de forma direta.' },
]
