import { NavLink } from 'react-router-dom'
import { PUBLIC_NAV_LINKS } from '@/constants/nav'
import { cn } from '@/lib/utils'

interface NavigationProps {
  orientation?: 'horizontal' | 'vertical'
  onNavigate?: () => void
  className?: string
}

export function Navigation({ orientation = 'horizontal', onNavigate, className }: NavigationProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col items-stretch gap-1' : 'items-center gap-7',
        className,
      )}
    >
      {PUBLIC_NAV_LINKS.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          end={link.href === '/'}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-sm text-sm font-medium text-muted-foreground outline-none transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2',
              orientation === 'vertical'
                ? 'rounded-lg px-3.5 py-3 text-base hover:bg-accent hover:text-accent-foreground'
                : [
                    'relative px-0.5 py-2 hover:text-foreground',
                    "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0",
                    'after:bg-action after:transition-transform after:duration-200',
                    'hover:after:scale-x-100',
                  ],
              isActive &&
                (orientation === 'vertical'
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground after:scale-x-100'),
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
