export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function textIncludes(haystack: string, needle: string): boolean {
  if (!needle.trim()) return true
  return normalizeText(haystack).includes(normalizeText(needle))
}
