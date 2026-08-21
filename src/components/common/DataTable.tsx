import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TableRowSkeleton } from './LoadingSkeleton'
import { EmptyState } from './EmptyState'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  sortable?: boolean
  className?: string
}

export type SortDirection = 'asc' | 'desc'

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  rowKey: (item: T) => string
  isLoading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  sortKey?: string
  sortDirection?: SortDirection
  onSortChange?: (key: string) => void
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyTitle = 'Nenhum registro encontrado',
  emptyDescription = 'Ajuste os filtros ou cadastre um novo registro.',
  emptyAction,
  sortKey,
  sortDirection = 'asc',
  onSortChange,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key)}
                      className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary"
                    >
                      {column.header}
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="size-3.5" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 text-muted-foreground/50" aria-hidden="true" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {!isLoading && (
            <TableBody>
              {data.map((item) => (
                <TableRow
                  key={rowKey(item)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.render(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      {isLoading && (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRowSkeleton key={index} columns={columns.length} />
          ))}
        </div>
      )}
      {!isLoading && data.length === 0 && (
        <div className="p-6">
          <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
        </div>
      )}
    </div>
  )
}
