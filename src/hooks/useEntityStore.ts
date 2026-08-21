import { useSyncExternalStore } from 'react'

interface Store<T> {
  subscribe(listener: () => void): () => void
  getSnapshot(): T
}

/** Subscribes a component to a module-singleton list store (see createListStore). */
export function useEntityStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.getSnapshot)
}
