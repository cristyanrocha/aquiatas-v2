import { useEffect } from 'react'

interface ShortcutOptions {
  ctrl?: boolean
  alt?: boolean
  /** Skip firing while the user is typing in an input/textarea/select. */
  ignoreWhenTyping?: boolean
  enabled?: boolean
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable
}

export function useKeyboardShortcut(key: string, callback: () => void, options: ShortcutOptions = {}) {
  const { ctrl = false, alt = false, ignoreWhenTyping = true, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== key.toLowerCase()) return
      if (Boolean(event.ctrlKey || event.metaKey) !== ctrl) return
      if (event.altKey !== alt) return
      if (ignoreWhenTyping && !ctrl && !alt && isTypingTarget(event.target)) return

      event.preventDefault()
      callback()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key, ctrl, alt, ignoreWhenTyping, enabled, callback])
}
