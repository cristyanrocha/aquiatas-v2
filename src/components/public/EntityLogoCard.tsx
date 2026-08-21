import type { ReactNode } from 'react'

interface EntityLogoCardProps {
  logoUrl: string
  name: string
  location?: string
  badge?: ReactNode
}

/** Shared logo + name + location card for Parceiros and Órgãos Públicos grids. */
export function EntityLogoCard({ logoUrl, name, location, badge }: EntityLogoCardProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex size-24 items-center justify-center rounded-xl border border-border bg-white p-3 shadow-sm sm:size-[108px] lg:size-[120px]">
        <img src={logoUrl} alt={name} className="size-full object-contain" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        {location && <span className="text-xs text-muted-foreground">{location}</span>}
        {badge}
      </div>
    </div>
  )
}
