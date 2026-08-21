/**
 * Formatting helpers. Internally dates are kept as ISO strings and values as
 * plain numbers (reais) so they map cleanly onto a future Postgres/Supabase
 * schema; these functions only handle the BR-locale display layer.
 */

export function formatCurrencyBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatDateBR(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export function formatDateTimeBR(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleString('pt-BR')
}

export function formatNumberBR(value: number): string {
  return value.toLocaleString('pt-BR')
}

/** yyyy-mm-dd for native <input type="date">. */
export function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10)
}

export function fromDateInputValue(dateInputValue: string): string {
  return new Date(`${dateInputValue}T00:00:00.000Z`).toISOString()
}

export function daysUntil(isoDate: string): number {
  const target = new Date(isoDate)
  const now = new Date()
  const targetUTC = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate())
  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((targetUTC - nowUTC) / (1000 * 60 * 60 * 24))
}
