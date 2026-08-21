import { cloneElement, isValidElement, useId, type ReactElement } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean; 'aria-describedby'?: string }>
}

export function FormField({ label, error, hint, required, className, children }: FormFieldProps) {
  const generatedId = useId()
  const fieldId = children.props.id ?? generatedId
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint ? `${fieldId}-hint` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  const child = isValidElement(children)
    ? cloneElement(children, {
        id: fieldId,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })
    : children

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {child}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
