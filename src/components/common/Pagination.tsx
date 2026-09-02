import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface AppPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageWindow(page: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const result: (number | 'ellipsis')[] = []
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) {
      result.push('ellipsis')
    }
    result.push(p)
  })
  return result
}

export function AppPagination({ page, totalPages, onPageChange }: AppPaginationProps) {
  if (totalPages <= 1) return null
  const pageWindow = getPageWindow(page, totalPages)

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page === 1}
            className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
            onClick={(event) => {
              event.preventDefault()
              if (page > 1) onPageChange(page - 1)
            }}
          />
        </PaginationItem>
        {pageWindow.map((item, index) =>
          item === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                className={item === page ? 'border-transparent bg-action text-white hover:bg-action-hover hover:text-white' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  onPageChange(item)
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === totalPages}
            className={page === totalPages ? 'pointer-events-none opacity-50' : undefined}
            onClick={(event) => {
              event.preventDefault()
              if (page < totalPages) onPageChange(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}
