// The shelf — which journals exist, what they're called and which cover they
// wear. Device-local, like the spreads themselves (see spreads.ts).
//
// This list used to live only in memory, seeded with one journal. Everything a
// person added after that was gone the next time the app opened — and because
// the list is what maps a journal to its saved pages, those pages were still on
// disk but no longer reachable from anywhere. Losing someone's scrapbook is the
// worst thing this app can do, so the shelf is written through on every change.

import { getItem, setItem } from './storage'

export interface StoredJournal {
  id: string
  name: string
  items: number
  edited: string
  coverKey?: string
}

const KEY = 'pp:journals'

/** The shelf as last saved, or null if nothing has been saved yet. */
export async function loadJournals(): Promise<StoredJournal[] | null> {
  const raw = await getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    // Keep only entries that can actually address a journal; a malformed row
    // would otherwise render a card that opens nothing.
    return parsed.filter(
      (j): j is StoredJournal => !!j && typeof j.id === 'string' && !!j.id,
    )
  } catch {
    return null
  }
}

/** Persist the shelf. Never throws — a storage failure must not break editing. */
export async function persistJournals(list: StoredJournal[]): Promise<void> {
  try {
    await setItem(KEY, JSON.stringify(list))
  } catch {
    /* best effort */
  }
}
