import { Toaster as SonnerToaster } from '@/components/ui/sonner'

export { toast } from 'sonner'

export function Toast() {
  return <SonnerToaster position="top-right" richColors closeButton />
}
