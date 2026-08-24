import type { LucideIcon } from 'lucide-react'
import { FileStack } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthPageShellProps {
  title: string
  description: string
  icon?: LucideIcon
  /** Set to false to hide the icon badge above the title (e.g. Entrar, Criar Conta). Defaults to true. */
  showIcon?: boolean
  children: ReactNode
  footer?: ReactNode
}

/** Shared shell for auth-flow pages (login, cadastro, recuperação de senha, meu perfil). */
export function AuthPageShell({ title, description, icon: Icon = FileStack, showIcon = true, children, footer }: AuthPageShellProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        {showIcon && (
          <div className="flex size-12 items-center justify-center rounded-full bg-primary-light text-brand">
            <Icon className="size-6" aria-hidden="true" />
          </div>
        )}
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>

      {footer && <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  )
}
