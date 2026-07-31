// "My Uploads" — the user's own imported files. A plain holding area, kept
// device-local and global to the whole app: the same uploads are available on
// every spread of every journal. Persisted as a small JSON list alongside the
// other launch/onboarding keys.

import { getItem, setItem } from './storage'

export interface Upload {
  id: string
  /** File uri from the image picker (same durability as placed photos). */
  uri: string
  /** width / height — lets us place the piece at its true proportions. */
  aspect: number
  addedAt: number
}

const KEY = 'pp:my-uploads'

export async function loadUploads(): Promise<Upload[]> {
  const raw = await getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Upload[]) : []
  } catch {
    return []
  }
}

export async function persistUploads(list: Upload[]): Promise<void> {
  await setItem(KEY, JSON.stringify(list))
}
