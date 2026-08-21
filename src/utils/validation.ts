import type { ContactFormData, ContactFormErrors, RegisterFormData, RegisterFormErrors } from '@/types'
import { unmask } from './masks'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8
const ORGAO_PUBLICO_ERROR = 'Informe a empresa ou o órgão público ao qual você está vinculado.'

/** Required, free-text — any non-blank value survives trim(). No format/lookup restrictions by design. */
export function validateOrgaoPublico(value: string): string | undefined {
  return value.trim() ? undefined : ORGAO_PUBLICO_ERROR
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function isValidPhoneDigits(value: string): boolean {
  const digits = unmask(value)
  return digits.length === 10 || digits.length === 11
}

/** At least 8 chars, containing both a letter and a digit. */
export function isStrongPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH && /[A-Za-z]/.test(value) && /\d/.test(value)
}

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!data.nome.trim()) {
    errors.nome = 'Informe seu nome.'
  } else if (data.nome.trim().length < 3) {
    errors.nome = 'Nome muito curto.'
  }

  if (!data.email.trim()) {
    errors.email = 'Informe seu email.'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email inválido.'
  }

  if (!data.telefone.trim()) {
    errors.telefone = 'Informe seu telefone.'
  } else if (!isValidPhoneDigits(data.telefone)) {
    errors.telefone = 'Telefone inválido.'
  }

  if (!data.assunto.trim()) {
    errors.assunto = 'Informe o assunto.'
  }

  if (!data.mensagem.trim()) {
    errors.mensagem = 'Escreva uma mensagem.'
  } else if (data.mensagem.trim().length < 10) {
    errors.mensagem = 'Mensagem muito curta.'
  }

  return errors
}

export function validateRegisterForm(data: RegisterFormData): RegisterFormErrors {
  const errors: RegisterFormErrors = {}
  const nomeNormalizado = data.nome.trim().replace(/\s+/g, ' ')

  if (!nomeNormalizado) {
    errors.nome = 'Informe seu nome completo.'
  } else if (nomeNormalizado.length < 3) {
    errors.nome = 'Nome muito curto.'
  }

  if (!data.email.trim()) {
    errors.email = 'Informe seu email.'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email inválido.'
  }

  if (data.telefone.trim() && !isValidPhoneDigits(data.telefone)) {
    errors.telefone = 'Telefone inválido.'
  }

  const orgaoPublicoError = validateOrgaoPublico(data.orgaoPublico)
  if (orgaoPublicoError) {
    errors.orgaoPublico = orgaoPublicoError
  }

  if (!data.senha) {
    errors.senha = 'Crie uma senha.'
  } else if (!isStrongPassword(data.senha)) {
    errors.senha = 'A senha deve ter no mínimo 8 caracteres, incluindo letra e número.'
  }

  if (!data.confirmarSenha) {
    errors.confirmarSenha = 'Confirme sua senha.'
  } else if (data.confirmarSenha !== data.senha) {
    errors.confirmarSenha = 'As senhas não coincidem.'
  }

  if (!data.aceitarTermos) {
    errors.aceitarTermos = 'É necessário aceitar os Termos de Uso e a Política de Privacidade.'
  }

  return errors
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean)
}
