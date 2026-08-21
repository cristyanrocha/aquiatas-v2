import type { AtaSituacao } from './ata.types'

export interface AtaFilters {
  search: string
  categoriaIds: string[]
  marcaIds: string[]
  tipoIds: string[]
  orgaoIds: string[]
  situacoes: AtaSituacao[]
}

export type AtaSortOption =
  | 'recentes'
  | 'validade'
  | 'menor_valor'
  | 'maior_valor'
  | 'alfabetica'

export interface PaginationState {
  page: number
  pageSize: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
