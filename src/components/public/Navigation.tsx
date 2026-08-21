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
        'flex gap-1',
        orientation === 'vertical' ? 'flex-col items-stretch' : 'items-center',
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
              'rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground',
              orientation === 'vertical' && 'py-3 text-base',
              isActive && 'bg-accent text-accent-foreground',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
