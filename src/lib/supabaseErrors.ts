import { PostgrestError } from '@supabase/supabase-js'

const AUTH_MESSAGES: Array<[RegExp, string]> = [
  [/invalid login credentials/i, 'Email ou senha inválidos.'],
  [/email not confirmed/i, 'Confirme seu email antes de entrar. Verifique sua caixa de entrada.'],
  [/user already registered|already been registered/i, 'Já existe uma conta cadastrada com este e-mail.'],
  [/password should be at least/i, 'A senha deve ter no mínimo 8 caracteres, incluindo letra e número.'],
  [/rate limit/i, 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'],
  [/token has expired|invalid.*token|otp expired/i, 'O link expirou ou é inválido. Solicite um novo.'],
  [/same password/i, 'A nova senha deve ser diferente da atual.'],
]

const POSTGRES_MESSAGES: Array<[string, string]> = [
  ['23505', 'Já existe um registro com esses dados.'],
  ['23503', 'Não é possível concluir: este registro está sendo usado em outro lugar.'],
  ['23514', 'Os dados informados não atendem às regras de validação.'],
  ['42501', 'Você não tem permissão para realizar esta ação.'],
]

const GENERIC_MESSAGE = 'Ocorreu um erro inesperado. Tente novamente em instantes.'

export function translateSupabaseError(error: unknown): string {
  if (isAuthError(error)) {
    const match = AUTH_MESSAGES.find(([pattern]) => pattern.test(error.message))
    return match ? match[1] : GENERIC_MESSAGE
  }

  if (isPostgrestError(error)) {
    const match = POSTGRES_MESSAGES.find(([code]) => code === error.code)
    if (match) return match[1]
    if (error.message.toLowerCase().includes('row-level security')) {
      return 'Você não tem permissão para realizar esta ação.'
    }
    return GENERIC_MESSAGE
  }

  if (error instanceof Error) {
    return error.message.length < 200 ? error.message : GENERIC_MESSAGE
  }

  return GENERIC_MESSAGE
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return typeof error === 'object' && error !== null && 'code' in error && 'message' in error && 'details' in error
}

/** Duck-types Supabase Auth errors (AuthApiError/AuthError) without importing @supabase/auth-js directly. */
function isAuthError(error: unknown): error is { name: string; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'name' in error &&
    typeof (error as { name: unknown }).name === 'string' &&
    (error as { name: string }).name.toLowerCase().includes('auth')
  )
}
