import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'

type MaskFn = (value: string) => string

interface MaskedInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  mask: MaskFn
  value: string
  onChange: (value: string) => void
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, value, onChange, ...props }, ref) => {
    return (
      <Input
        {...props}
        ref={ref}
        value={value}
        onChange={(event) => onChange(mask(event.target.value))}
        inputMode="numeric"
      />
    )
  },
)
MaskedInput.displayName = 'MaskedInput'
