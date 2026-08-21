export interface ContactFormData {
  nome: string
  email: string
  telefone: string
  assunto: string
  mensagem: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>
