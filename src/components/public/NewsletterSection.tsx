import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/common/Toast'
import { isValidEmail } from '@/utils/validation'
import { newsletterService } from '@/services/newsletterService'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setError('Informe um email válido.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await newsletterService.subscribe(email)
      toast.success('Inscrição realizada! Você passará a receber novas atas por email.')
      setEmail('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível concluir a inscrição. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-brand py-14 text-primary-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <Mail className="size-8" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">Receba novas atas no seu email</h2>
        <p className="text-sm text-primary-foreground/80">
          Cadastre-se para ser avisado sobre novas Atas de Registro de Preços e oportunidades.
        </p>
        <form onSubmit={handleSubmit} noValidate className="mt-2 flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'newsletter-error' : undefined}
              className="bg-white text-foreground"
            />
          </div>
          <Button type="submit" variant="secondary" className="shrink-0" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Inscrever-se'}
          </Button>
        </form>
        {error && (
          <p id="newsletter-error" role="alert" className="text-xs font-medium text-warning">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
