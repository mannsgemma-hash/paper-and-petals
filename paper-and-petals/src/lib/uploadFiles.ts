// Durable storage for My Uploads. The image picker returns a uri in the app's
// *cache* directory, which iOS can reclaim under storage pressure — so a plain
// holding area built on those uris would lose files over time. Here we copy each
// import into the document directory (safe from system deletion) and hand back a
// stable uri. Kept separate from uploads.ts so the store never imports the
// native file-system module.
//
// Expo SDK 56 file-system API (object-oriented): Paths / File / Directory.

import { Directory, File, Paths } from 'expo-file-system'

const UPLOADS_DIR = 'uploads'

function uploadsDir(): Directory {
  const dir = new Directory(Paths.document, UPLOADS_DIR)
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true })
  return dir
}

/**
 * Copy a just-picked image out of the picker cache into the document directory.
 * Returns the durable `file://` uri, or the original uri if the copy fails (so a
 * file-system hiccup degrades to today's behaviour rather than losing the pick).
 */
export async function persistUploadFile(sourceUri: string, id: string): Promise<string> {
  try {
    const src = new File(sourceUri)
    const ext = src.extension || '.jpg' // includes the leading dot
    const dest = new File(uploadsDir(), `${id}${ext}`)
    await src.copy(dest, { overwrite: true })
    return dest.uri
  } catch (e) {
    console.warn('Upload copy failed; keeping original uri', e)
    return sourceUri
  }
}

/**
 * Delete a durable upload file when it's removed from the holding area. Only
 * touches files inside our uploads directory, and never throws.
 */
export async function deleteUploadFile(uri: string): Promise<void> {
  try {
    if (!uri.includes(`/${UPLOADS_DIR}/`)) return
    const file = new File(uri)
    if (file.exists) file.delete()
  } catch {
    // Best-effort cleanup — an orphaned file is harmless.
  }
}
