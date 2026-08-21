/** Deterministic placeholder images (picsum.photos with fixed seeds), used as a fallback when a record has no uploaded image. */
export function placeholderImage(seed: string, width = 600, height = 400): string {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`
}

export function placeholderAvatar(seed: string, size = 128): string {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&size=${size}`
}
