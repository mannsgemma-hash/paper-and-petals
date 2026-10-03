import * as Sharing from 'expo-sharing'
import { Directory, File, Paths } from 'expo-file-system'

// expo-file-system legacy API, kept only as a fallback for the byte paths below.
// require() (not import) so a build without the native module degrades rather
// than failing to load.
let Legacy: any
try {
  Legacy = require('expo-file-system/legacy')
} catch {
  Legacy = null
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
 * Bytes in and bytes out, never base64.
 *
 * The first version of this read each page as a base64 string, handed those to
 * JSZip, generated the whole archive as one more base64 string, then wrote that
 * back out. Base64 is 4/3 the size, a JS string stores it two bytes per
 * character, and every stage was held at once — so a handful of 3000px print
 * pages peaked at several times their real weight and the OS killed the app,
 * right at the end, just as the last page finished downloading.
 */
/** A page's contents, as raw bytes where the platform allows it. */
type Payload = { data: Uint8Array | string; base64: boolean }

async function readPayload(file: File): Promise<Payload> {
  const f = file as any
  if (typeof f.bytes === 'function') return { data: f.bytes(), base64: false }
  if (Legacy?.readAsStringAsync) {
    // Older build: one page at a time as base64 is still far better than the
    // whole archive at once, which is what used to blow up.
    const b64 = await Legacy.readAsStringAsync(file.uri, { encoding: 'base64' })
    return { data: b64, base64: true }
  }
  throw new Error('Reading files isn’t available in this build.')
}

/** Write the finished archive, preferring bytes and falling back to base64. */
async function writeArchive(zip: any, out: File): Promise<void> {
  if (typeof (out as any).write === 'function') {
    const bytes: Uint8Array = await zip.generateAsync({ type: 'uint8array', compression: 'STORE' })
    ;(out as any).write(bytes)
    return
  }
  if (!Legacy?.writeAsStringAsync) throw new Error('Writing files isn’t available in this build.')
  const b64: string = await zip.generateAsync({ type: 'base64', compression: 'STORE' })
  await Legacy.writeAsStringAsync(out.uri, b64, { encoding: 'base64' })
}

/** Total size of the pages, so an impossible download fails kindly. */
const MAX_TOTAL_BYTES = 400 * 1024 * 1024

/**
 * Download a collection's high-res print pages, bundle them into a single zip,
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
  const withUrl = pieces.filter((p): p is Required<DownloadablePiece> => !!p.url)
  // Pieces cut from one sheet share that sheet as their print file, so several
  // pieces can point at the same URL — download each page once.
  const seen = new Set<string>()
  const usable = withUrl.filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)))
  if (usable.length === 0) {
    throw new Error('The print files for this collection aren’t ready yet — please try again later.')
  }

  const dir = new Directory(Paths.cache, 'pp-print')
  try {
    if (!dir.exists) dir.create({ intermediates: true, idempotent: true })
  } catch {
    /* already there */
  }

  const downloaded: { file: File; label: string }[] = []
  // Whatever was handed to the share sheet must outlive this function: iOS may
  // still be copying it into Files after the sheet reports it is done.
  let sharedUri: string | null = null
  let total = 0
  try {
    for (let i = 0; i < usable.length; i++) {
      const p = usable[i]
      const label = `${String(i + 1).padStart(2, '0')}-${slug(p.name)}.png`
      const dest = new File(dir, `${i}-${slug(p.name)}.png`)
      if (dest.exists) dest.delete()
      const file = await File.downloadFileAsync(p.url, dest, { idempotent: true })
      total += file.size ?? 0
      if (total > MAX_TOTAL_BYTES) {
        throw new Error(
          'This collection’s print files are too large to bundle on the device. ' +
            'Please get in touch and we’ll send them to you.',
        )
      }
      downloaded.push({ file, label })
      onProgress?.(i + 1, usable.length)
    }

    // One page needs no archive — hand over the PNG itself. Most collections
    // are a sheet or two, so this is the common path and it costs no memory.
    if (downloaded.length === 1) {
      sharedUri = downloaded[0].file.uri
      await share(sharedUri, collectionName, 'image/png', 'public.png')
      return
    }

    if (!JSZip) throw new Error('Zip support is unavailable in this build.')
    const zip = new JSZip()
    const folder = zip.folder(slug(collectionName)) ?? zip
    for (const d of downloaded) {
      // STORE, not DEFLATE: PNGs are already compressed, so deflating them
      // buys nothing and allocates a second buffer for every page.
      const payload = await readPayload(d.file)
      folder.file(d.label, payload.data, {
        base64: payload.base64,
        binary: !payload.base64,
        compression: 'STORE',
      })
    }

    const out = new File(dir, `${slug(collectionName)}-print.zip`)
    if (out.exists) out.delete()
    out.create()
    await writeArchive(zip, out)

    await share(out.uri, collectionName, 'application/zip', 'public.zip-archive')
  } finally {
    // The pages are only the raw material for the archive; the share sheet has
    // what it needs by now, so don't leave hundreds of MB in the cache.
    for (const d of downloaded) {
      if (d.file.uri === sharedUri) continue
      try {
        if (d.file.exists) d.file.delete()
      } catch {
        /* best-effort */
      }
    }
  }
}

async function share(uri: string, collectionName: string, mimeType: string, UTI: string) {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing isn’t available on this device.')
  }
  await Sharing.shareAsync(uri, {
    mimeType,
    dialogTitle: `${collectionName} — print files`,
    UTI,
  })
}
