import { createContext, useMemo, useState, type ReactNode } from 'react'

interface SearchPaletteContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const SearchPaletteContext = createContext<SearchPaletteContextValue | undefined>(undefined)

export function SearchPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo<SearchPaletteContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }),
    [isOpen],
  )

  return <SearchPaletteContext.Provider value={value}>{children}</SearchPaletteContext.Provider>
}
