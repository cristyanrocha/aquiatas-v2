import type { ReactNode } from 'react'

interface AdminFormSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/** Groups related fields inside a longer admin form (e.g. "Produto", "Ata / Processo"). */
export function AdminFormSection({ title, description, children }: AdminFormSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-sm font-semibold tracking-wide text-foreground uppercase">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}
