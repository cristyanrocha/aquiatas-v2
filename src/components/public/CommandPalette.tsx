import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Building2, Landmark, Info, Tag, Mail } from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useSearchPalette } from '@/hooks/useSearchPalette'
import { useEntityStore } from '@/hooks/useEntityStore'
import { publicAtaStore } from '@/services/ataService'
import { textIncludes } from '@/utils/text'
import { formatCurrencyBRL } from '@/utils/format'
import { ROUTES } from '@/constants/routes'
import { PUBLIC_NAV_LINKS } from '@/constants/nav'

const NAV_ICONS: Record<string, typeof Building2> = {
  '/parceiros': Building2,
  '/orgaos': Landmark,
  '/quem-somos': Info,
  '/precos': Tag,
  '/contato': Mail,
}

export function CommandPalette() {
  const { isOpen, close } = useSearchPalette()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { data: atas } = useEntityStore(publicAtaStore)

  const matchedAtas = useMemo(() => {
    if (!query.trim()) return []
    return atas
      .filter((ata) => textIncludes(`${ata.descricao} ${ata.marcaNome} ${ata.orgaoNome}`, query))
      .slice(0, 6)
  }, [atas, query])

  function handleSelectAta(slug: string) {
    close()
    setQuery('')
    navigate(ROUTES.ataDetalhe(slug))
  }

  function handleSelectNav(href: string) {
    close()
    setQuery('')
    navigate(href)
  }

  function handleSearchAll() {
    close()
    const trimmed = query.trim()
    navigate(trimmed ? `${ROUTES.home}?busca=${encodeURIComponent(trimmed)}` : ROUTES.home)
    setQuery('')
  }

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => (open ? undefined : close())}
      title="Busca rápida"
      description="Busque atas, páginas e parceiros"
    >
      <Command>
        <CommandInput
          placeholder="Buscar atas, páginas..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {matchedAtas.length > 0 && (
            <CommandGroup heading="Atas">
              {matchedAtas.map((ata) => (
                <CommandItem key={ata.id} value={ata.descricao} onSelect={() => handleSelectAta(ata.slug)}>
                  <FileText />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate">{ata.descricao}</span>
                    <span className="text-xs text-muted-foreground">
                      {ata.orgaoNome} • {formatCurrencyBRL(ata.valorUnitario)}
                    </span>
                  </div>
                </CommandItem>
              ))}
              <CommandItem value="ver-todos-resultados" forceMount onSelect={handleSearchAll}>
                Ver todos os resultados para "{query}"
              </CommandItem>
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="Páginas">
            {PUBLIC_NAV_LINKS.filter((link) => link.href !== '/').map((link) => {
              const Icon = NAV_ICONS[link.href] ?? FileText
              return (
                <CommandItem key={link.href} value={link.label} onSelect={() => handleSelectNav(link.href)}>
                  <Icon />
                  {link.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
