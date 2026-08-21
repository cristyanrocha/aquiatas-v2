import { SocialIcon } from './SocialIcon'
import { cn } from '@/lib/utils'
import type { SocialLink } from '@/constants/social'

interface SocialIconLinkProps {
  social: SocialLink
  className?: string
}

/** Shared circular social-network icon link used in the footer and institutional pages. */
export function SocialIconLink({ social, className }: SocialIconLinkProps) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-200 hover:border-brand hover:bg-primary-light hover:text-brand',
        className,
      )}
    >
      <SocialIcon icon={social.icon} />
    </a>
  )
}
