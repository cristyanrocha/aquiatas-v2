import type { LucideIcon } from 'lucide-react'

export interface Category {
  id: string
  nome: string
  slug: string
  icon: LucideIcon
  createdAt: string
  updatedAt: string
}

export interface AtaType {
  id: string
  nome: string
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: string
  nome: string
}
