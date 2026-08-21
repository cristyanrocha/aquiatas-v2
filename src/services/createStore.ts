import { translateSupabaseError } from '@/lib/supabaseErrors'

export interface ListState<T> {
  data: T[]
  isLoading: boolean
  error: string | null
}

type Listener = () => void

/**
 * Reactive cache for a Supabase list query, read via useSyncExternalStore
 * (see useEntityStore). Fetches lazily on first subscribe and exposes
 * refresh() so mutations (create/update/delete) can invalidate the cache —
 * there is no local write path here, every mutation goes straight to Supabase.
 */
export function createListStore<T>(fetchFn: () => Promise<T[]>) {
  let state: ListState<T> = { data: [], isLoading: false, error: null }
  let hasFetched = false
  let inFlight: Promise<void> | null = null
  let pendingRefresh = false
  const listeners = new Set<Listener>()

  function setState(next: Partial<ListState<T>>) {
    state = { ...state, ...next }
    listeners.forEach((listener) => listener())
  }

  function load(): Promise<void> {
    if (inFlight) {
      // A fetch already in flight was kicked off before this call — its result may not
      // reflect a mutation that just happened (e.g. a quick-add during initial load).
      // Flag it so a fresh fetch runs right after, instead of silently dropping this refresh.
      pendingRefresh = true
      return inFlight
    }
    setState({ isLoading: true, error: null })
    inFlight = fetchFn()
      .then((data) => setState({ data, isLoading: false }))
      .catch((error: unknown) => setState({ isLoading: false, error: translateSupabaseError(error) }))
      .finally(() => {
        inFlight = null
        if (pendingRefresh) {
          pendingRefresh = false
          void load()
        }
      })
    return inFlight
  }

  return {
    subscribe(listener: Listener) {
      listeners.add(listener)
      if (!hasFetched) {
        hasFetched = true
        void load()
      }
      return () => {
        listeners.delete(listener)
      }
    },

    getSnapshot(): ListState<T> {
      return state
    },

    refresh(): Promise<void> {
      return load()
    },
  }
}

export type ListStore<T> = ReturnType<typeof createListStore<T>>
