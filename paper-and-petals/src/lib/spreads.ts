// Persistence for a journal's spreads. Journals live only on the device: there
// is no cloud copy until the app has accounts, because a journal id is unique
// per device, not per person, and can't safely address anyone's data on a
// server.

import { getItem, setItem } from './storage'

const keyFor = (journalId: string) => `pp:spreads:${journalId}`

/** Read a journal's saved spreads from the device, or null if none stored. */
export async function loadLocalSpreads<T>(journalId: string): Promise<T[] | null> {
  const raw = await getItem(keyFor(journalId))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as T[]) : null
  } catch {
    return null
  }
}

/** Persist a journal's spreads to the device. Never throws. */
export async function saveLocalSpreads<T>(journalId: string, pages: T[]): Promise<void> {
  try {
    await setItem(keyFor(journalId), JSON.stringify(pages))
  } catch {
    // Best-effort: a storage failure must not break editing.
  }
}
