// studio/pipeline/lib/image.mjs
//
// Shared image processing used by extract.mjs (explicit CLI) and prep.mjs
// (filename-tag driven, in-place). Pure functions — options in, buffers out.

import sharp from 'sharp'

export const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

// ─── Filename tags ──────────────────────────────────────────────────────────────
// A file named  "<anything>_split.png"  is a sheet to split into pieces;
//               "<anything>_cut.png"    is a single element needing background
// removal. (Hyphen variants "-split"/"-cut" work too; case-insensitive.)

const TAG_RE = /[-_](split|cut)$/i

/** 'split' | 'cut' | null for a filename (with or without extension). */
export function fileTag(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  const m = base.match(TAG_RE)
  return m ? m[1].toLowerCase() : null
}

/** Filename without its extension and without the processing tag. */
export function cleanBase(filename) {
  return filename.replace(/\.[^.]+$/, '').replace(TAG_RE, '')
}

// ─── Background removal ─────────────────────────────────────────────────────────

let bgRemover
async function loadBgRemover() {
  if (bgRemover !== undefined) return bgRemover
  try {
    const mod = await import('@imgly/background-removal-node')
    bgRemover = mod.removeBackground ?? mod.default?.removeBackground ?? null
  } catch {
    bgRemover = null
    console.warn('  ⚠ background removal unavailable (npm i @imgly/background-removal-node to enable)')
  }
  return bgRemover
}

/** Remove background if needed; returns a sharp pipeline capped to maxEdge. */
async function toTransparent(buf, { forceBg = false, noBg = false, maxEdge = 2400 } = {}) {
  let working = buf
  const meta = await sharp(buf).metadata()
  if (forceBg || (!noBg && !meta.hasAlpha)) {
    const remove = await loadBgRemover()
    if (remove) {
      try {
        // Hand the remover a real PNG Blob with an explicit type — a bare buffer
        // gets wrapped as a typeless blob and fails format detection.
        const pngInput = await sharp(working).png().toBuffer()
        const result = await remove(new Blob([pngInput], { type: 'image/png' }))
        working = Buffer.from(await result.arrayBuffer())
      } catch (e) {
        console.warn(`  ⚠ background removal failed (${e?.message ?? e}) — using original`)
      }
    }
  }
  return sharp(working)
    .ensureAlpha()
    .resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true })
}

/** Single element: remove background (if needed) → transparent PNG buffer. */
export async function cutoutPng(buf, opts = {}) {
  return (await toTransparent(buf, opts)).png().toBuffer()
}

// ─── Sheet splitting ────────────────────────────────────────────────────────────

/** Grow the mask by r px (separable max filter) so thin breaks in one item bridge. */
function dilate(mask, w, h, r) {
  if (r <= 0) return mask
  const tmp = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    const row = y * w
    for (let x = 0; x < w; x++) {
      let on = 0
      for (let dx = -r; dx <= r && !on; dx++) {
        const xx = x + dx
        if (xx >= 0 && xx < w && mask[row + xx]) on = 1
      }
      tmp[row + x] = on
    }
  }
  const out = new Uint8Array(w * h)
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let on = 0
      for (let dy = -r; dy <= r && !on; dy++) {
        const yy = y + dy
        if (yy >= 0 && yy < h && tmp[yy * w + x]) on = 1
      }
      out[y * w + x] = on
    }
  }
  return out
}

/** Label connected blobs (8-connectivity, stack flood fill). */
function connectedComponents(mask, w, h) {
  const labels = new Int32Array(w * h)
  const blobs = []
  const stack = []
  let next = 0
  for (let i = 0; i < w * h; i++) {
    if (!mask[i] || labels[i]) continue
    next++
    let minx = w, miny = h, maxx = 0, maxy = 0, area = 0
    stack.push(i)
    labels[i] = next
    while (stack.length) {
      const p = stack.pop()
      const x = p % w
      const y = (p / w) | 0
      area++
      if (x < minx) minx = x
      if (x > maxx) maxx = x
      if (y < miny) miny = y
      if (y > maxy) maxy = y
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue
          const xx = x + dx
          const yy = y + dy
          if (xx < 0 || xx >= w || yy < 0 || yy >= h) continue
          const q = yy * w + xx
          if (mask[q] && !labels[q]) {
            labels[q] = next
            stack.push(q)
          }
        }
      }
    }
    blobs.push({ label: next, minx, miny, maxx, maxy, area })
  }
  return { labels, blobs }
}

/** Crop one blob out of the full RGBA buffer, keeping only its own pixels. */
async function cropBlob(rgba, w, blob, pad) {
  const bw = blob.maxx - blob.minx + 1
  const bh = blob.maxy - blob.miny + 1
  const out = Buffer.alloc(bw * bh * 4) // zero-filled = transparent
  for (let y = blob.miny; y <= blob.maxy; y++) {
    for (let x = blob.minx; x <= blob.maxx; x++) {
      const src = y * w + x
      if (blob.labels[src] !== blob.label) continue
      const s = src * 4
      const o = ((y - blob.miny) * bw + (x - blob.minx)) * 4
      out[o] = rgba[s]
      out[o + 1] = rgba[s + 1]
      out[o + 2] = rgba[s + 2]
      out[o + 3] = rgba[s + 3]
    }
  }
  // Encode to PNG before any re-wrap — a trimmed *raw* buffer has no format header.
  let png
  try {
    png = await sharp(out, { raw: { width: bw, height: bh, channels: 4 } }).trim().png().toBuffer()
  } catch {
    png = await sharp(out, { raw: { width: bw, height: bh, channels: 4 } }).png().toBuffer()
  }
  if (pad > 0) {
    png = await sharp(png)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  }
  return png
}

/**
 * Split a sheet into individual transparent PNGs.
 * Returns { pieces: Buffer[], blobs, width, height } in reading order.
 */
export async function splitToPieces(
  buf,
  { gap = 4, alpha = 16, minSize = 28, pad = 12, maxEdge = 2400, forceBg = false, noBg = false } = {},
) {
  const { data, info } = await (await toTransparent(buf, { forceBg, noBg, maxEdge }))
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) mask[i] = data[i * channels + (channels - 1)] > alpha ? 1 : 0
  const grown = dilate(mask, w, h, gap)
  const { labels, blobs } = connectedComponents(grown, w, h)

  const kept = blobs
    .filter((b) => Math.max(b.maxx - b.minx + 1, b.maxy - b.miny + 1) >= minSize)
    // reading order: top-to-bottom, then left-to-right (banded by ~rows)
    .sort((a, b) => (Math.abs(a.miny - b.miny) > h * 0.06 ? a.miny - b.miny : a.minx - b.minx))

  const pieces = []
  for (const blob of kept) {
    pieces.push(await cropBlob(data, w, { ...blob, labels }, pad))
  }
  return { pieces, blobs: blobs.length, width: w, height: h }
}
