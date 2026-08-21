import { useState } from 'react'
import { Mail, MapPin, MessageCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FormField, Seo, toast } from '@/components/common'
import { MaskedInput } from '@/components/forms'
import { maskPhone } from '@/utils/masks'
import { validateContactForm, hasErrors } from '@/utils/validation'
import { contactService } from '@/services/contactService'
import { getWhatsAppUrl } from '@/constants/social'
import type { ContactFormData, ContactFormErrors } from '@/types'

const INITIAL_FORM: ContactFormData = { nome: '', email: '', telefone: '', assunto: '', mensagem: '' }

const RATE_LIMIT_MS = 30_000

export function ContatoPage() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM)
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0)

  function updateField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // Honeypot: a hidden field only a bot would fill in. Silently pretend success.
    if (honeypot) {
      setForm(INITIAL_FORM)
      toast.success('Mensagem enviada com sucesso! Em breve entraremos em contato.')
      return
    }

    if (Date.now() - lastSubmittedAt < RATE_LIMIT_MS) {
      toast.error('Aguarde alguns instantes antes de enviar outra mensagem.')
      return
    }

    const validation = validateContactForm(form)
    setErrors(validation)
    if (hasErrors(validation)) return

    setIsSubmitting(true)
    try {
      await contactService.submit(form)
      toast.success('Mensagem enviada com sucesso! Em breve entraremos em contato.')
      setForm(INITIAL_FORM)
      setErrors({})
      setLastSubmittedAt(Date.now())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível enviar sua mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo
        title="Contato"
        description="Fale com a equipe da AquiAtas para tirar dúvidas ou divulgar suas Atas de Registro de Preços."
        path="/contato"
      />

      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Fale Conosco</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tire suas dúvidas ou envie uma sugestão para nossa equipe.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm lg:gap-8 lg:p-8">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 size-5 text-brand" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">contato@aquiatas.com.br</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 size-5 text-brand" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">WhatsApp</p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-brand hover:underline"
              >
                (61) 98101-9364
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-6 text-brand" strokeWidth={2.25} aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Endereço</p>
              <p className="text-sm text-muted-foreground">
                SCS Quadra 1, Bloco M, nº 30, Sala 701 – Ed. Gilberto Salomão, Asa Sul, Brasília/DF, CEP 70.305-900.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] size-px opacity-0"
          />
          <FormField label="Nome" error={errors.nome} required>
            <Input value={form.nome} onChange={(event) => updateField('nome', event.target.value)} autoComplete="name" />
          </FormField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Email" error={errors.email} required>
              <Input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} autoComplete="email" />
            </FormField>
            <FormField label="Telefone" error={errors.telefone} required>
              <MaskedInput mask={maskPhone} value={form.telefone} onChange={(value) => updateField('telefone', value)} placeholder="(00) 00000-0000" autoComplete="tel" />
            </FormField>
          </div>
          <FormField label="Assunto" error={errors.assunto} required>
            <Input value={form.assunto} onChange={(event) => updateField('assunto', event.target.value)} />
          </FormField>
          <FormField label="Mensagem" error={errors.mensagem} required>
            <Textarea rows={5} value={form.mensagem} onChange={(event) => updateField('mensagem', event.target.value)} />
          </FormField>
          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
          </Button>
        </form>
      </div>
    </div>
  )
}
