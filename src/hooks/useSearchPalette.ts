import { useContext } from 'react'
import { SearchPaletteContext } from '@/contexts/SearchPaletteContext'

export function useSearchPalette() {
  const context = useContext(SearchPaletteContext)
  if (!context) throw new Error('useSearchPalette deve ser usado dentro de SearchPaletteProvider.')
  return context
}
