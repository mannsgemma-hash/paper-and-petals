import * as Sharing from 'expo-sharing'

// expo-file-system: prefer the stable legacy classic API; fall back to the
// package root. require() (not import) keeps this graceful if the native module
// isn't in the current build, and avoids a hard type dependency.
let FileSystem: any
try {
  FileSystem = require('expo-file-system/legacy')
} catch {
  try {
    FileSystem = require('expo-file-system')
  } catch {
    FileSystem = null
  }
}

let JSZip: any
try {
  JSZip = require('jszip')
} catch {
  JSZip = null
}

export interface DownloadablePiece {
  name: string
  url?: string
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'piece'

/**
 * Download a collection's high-res print PNGs, bundle them into a single zip,
 * and open the share sheet (Save to Files / AirDrop to a computer for printing).
 *
 * Owner-gating is the caller's job — only show this to outright purchasers
 * (`ownedCollections[id]`), never to subscription-only users.
 */
export async function downloadCollectionZip(
  collectionName: string,
  pieces: DownloadablePiece[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  if (!FileSystem?.cacheDirectory) {
    throw new Error('Downloading needs the full app build (file system unavailable here).')
  }
  if (!JSZip) throw new Error('Zip support is unavailable in this build.')

  const withUrl = pieces.filter((p): p is Required<DownloadablePiece> => !!p.url)
  // Pieces cut from one sheet share that sheet as their print file, so several
  // pieces can point at the same URL — download each page once.
  const seen = new Set<string>()
  const usable = withUrl.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)))
  if (usable.length === 0) {
    throw new Error('The print files for this collection aren’t ready yet — please try again later.')
  }

  const zip = new JSZip()
  const folder = zip.folder(slug(collectionName)) ?? zip
  const tmpDir = `${FileSystem.cacheDirectory}pp-print/`
  try {
    await FileSystem.makeDirectoryAsync(tmpDir, { intermediates: true })
  } catch {
    /* already exists */
  }

  for (let i = 0; i < usable.length; i++) {
    const p = usable[i]
    const fileUri = `${tmpDir}${i}-${slug(p.name)}.png`
    const { uri } = await FileSystem.downloadAsync(p.url, fileUri)
    const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
    folder.file(`${String(i + 1).padStart(2, '0')}-${slug(p.name)}.png`, b64, { base64: true })
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true })
    } catch {
      /* best-effort cleanup */
    }
    onProgress?.(i + 1, usable.length)
  }

  const zipB64 = await zip.generateAsync({ type: 'base64' })
  const zipUri = `${FileSystem.cacheDirectory}${slug(collectionName)}-print.zip`
  await FileSystem.writeAsStringAsync(zipUri, zipB64, { encoding: FileSystem.EncodingType.Base64 })

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing isn’t available on this device.')
  }
  await Sharing.shareAsync(zipUri, {
    mimeType: 'application/zip',
    dialogTitle: `${collectionName} — print files`,
    UTI: 'public.zip-archive',
  })
}
