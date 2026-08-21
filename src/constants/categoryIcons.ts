import {
  Laptop,
  Armchair,
  Car,
  HeartPulse,
  Paperclip,
  Wrench,
  Shirt,
  Utensils,
  BookOpen,
  Building,
  type LucideIcon,
} from 'lucide-react'

export interface CategoryIconOption {
  id: string
  label: string
  icon: LucideIcon
}

export const CATEGORY_ICON_OPTIONS: CategoryIconOption[] = [
  { id: 'laptop', label: 'Tecnologia', icon: Laptop },
  { id: 'armchair', label: 'Mobiliário', icon: Armchair },
  { id: 'car', label: 'Veículos', icon: Car },
  { id: 'heart-pulse', label: 'Saúde', icon: HeartPulse },
  { id: 'paperclip', label: 'Escritório', icon: Paperclip },
  { id: 'wrench', label: 'Manutenção', icon: Wrench },
  { id: 'shirt', label: 'Vestuário', icon: Shirt },
  { id: 'utensils', label: 'Alimentação', icon: Utensils },
  { id: 'book-open', label: 'Educação', icon: BookOpen },
  { id: 'building', label: 'Infraestrutura', icon: Building },
]

export function findIconOptionByComponent(icon: LucideIcon): CategoryIconOption {
  return CATEGORY_ICON_OPTIONS.find((option) => option.icon === icon) ?? CATEGORY_ICON_OPTIONS[0]
}
