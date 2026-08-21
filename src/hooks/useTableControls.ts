import { useMemo, useState } from 'react'
import type { SortDirection } from '@/components/common/DataTable'
import { textIncludes } from '@/utils/text'

interface UseTableControlsOptions<T> {
  data: T[]
  searchFields: (item: T) => string[]
  sortFns: Record<string, (a: T, b: T) => number>
  defaultSortKey: string
  pageSize?: number
}

export function useTableControls<T>({
  data,
  searchFields,
  sortFns,
  defaultSortKey,
  pageSize = 10,
}: UseTableControlsOptions<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(defaultSortKey)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)

  function onSortChange(key: string) {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
    setPage(1)
  }

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    return data.filter((item) => searchFields(item).some((field) => textIncludes(field, search)))
  }, [data, search, searchFields])

  const sorted = useMemo(() => {
    const comparator = sortFns[sortKey]
    if (!comparator) return filtered
    const result = [...filtered].sort(comparator)
    return sortDirection === 'asc' ? result : result.reverse()
  }, [filtered, sortFns, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

  return {
    search,
    setSearch: updateSearch,
    sortKey,
    sortDirection,
    onSortChange,
    page: safePage,
    setPage,
    totalPages,
    total: sorted.length,
    paged,
  }
}
