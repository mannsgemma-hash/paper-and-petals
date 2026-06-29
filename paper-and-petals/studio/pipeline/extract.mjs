// studio/pipeline/extract.mjs
//
// Two jobs in one tool:
//   1. Batch background removal   — folder/file of art → transparent PNGs.
//   2. Sheet splitting (--split)  — a page of many elements → each item saved
//      separately, cut out on its own transparent background.
//
// Splitting works by removing the background, then finding connected blobs of
// non-transparent pixels and cropping each one. Great for sticker sheets and
// "contact sheet" style generations where items are visually separated; items
// that physically touch get merged (raise --gap to bridge thin breaks, or it
// keeps them as one).
//
// Usage (from studio/):
//   node pipeline/extract.mjs <input> [options]
//     <input>            an image file OR a folder of images
//   --split              split each input into individual items
//   --out <dir>          output folder (default: pipeline/extracted)
//   --min-size <px>      ignore blobs smaller than this on the long edge (default 28)
//   --gap <px>           bridge gaps up to N px so split parts of one item stay together (default 4)
//   --pad <px>           transparent padding around each saved item (default 12)
//   --alpha <0-255>      alpha cutoff that counts as "ink" (default 16)
//   --max-edge <px>      working resolution cap (default 2400)
//   --remove-bg          force background removal even on transparent input
//   --no-bg              never remove background (input is already cut out)
//
// Examples:
//   node pipeline/extract.mjs ./sheets/spring-stickers.png --split --out ./incoming/Spring\ Meadow
//   node pipeline/extract.mjs ./raw --out ./cutouts            # just remove backgrounds

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const argv = process.argv.slice(2)
const BOOL_FLAGS = new Set(['--split', '--remove-bg', '--no-bg'])
const hasFlag = (f) => argv.includes(f)
const getOpt = (f, d) => {
  const i = argv.indexOf(f)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d
}
// Positionals = args that are neither an option name nor the value after a value-option.
const positional = []
for (let i = 0; i < argv.length; i++) {
  const a = argv[i]
  if (a.startsWith('--')) continue
  const prev = argv[i - 1]
  if (prev && prev.startsWith('--') && !BOOL_FLAGS.has(prev)) continue
  positional.push(a)
}

const INPUT = positional[0]
const SPLIT = hasFlag('--split')
const OUT_DIR = path.resolve(getOpt('--out', path.join(SCRIPT_DIR, 'extracted')))
const MIN_SIZE = Number(getOpt('--min-size', 28))
const GAP = Number(getOpt('--gap', 4))
const PAD = Number(getOpt('--pad', 12))
const ALPHA = Number(getOpt('--alpha', 16))
const MAX_EDGE = Number(getOpt('--max-edge', 2400))
const FORCE_BG = hasFlag('--remove-bg')
const NO_BG = hasFlag('--no-bg')

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

/** Remove background if needed and cap to the working resolution. Returns a sharp pipeline. */
async function toTransparent(buf) {
  let working = buf
  const meta = await sharp(buf).metadata()
  if (FORCE_BG || (!NO_BG && !meta.hasAlpha)) {
    const remove = await loadBgRemover()
    if (remove) {
      try {
        const blob = await remove(working)
        working = Buffer.from(await blob.arrayBuffer())
      } catch (e) {
        console.warn(`  ⚠ background removal failed (${e?.message ?? e}) — using original`)
      }
    }
  }
  return sharp(working)
    .ensureAlpha()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
}

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

/** Label connected blobs (8-connectivity, stack flood fill). Returns labels + per-blob bbox/area. */
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
async function cropBlob(rgba, w, blob) {
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
  if (PAD > 0) {
    png = await sharp(png)
      .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
  }
  return png
}

async function splitSheet(buf, baseName) {
  const { data, info } = await (await toTransparent(buf)).raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info
  // Binary mask from the alpha channel.
  const mask = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) mask[i] = data[i * channels + (channels - 1)] > ALPHA ? 1 : 0
  const grown = dilate(mask, w, h, GAP)
  const { labels, blobs } = connectedComponents(grown, w, h)

  // Keep meaningful blobs: long-edge >= MIN_SIZE.
  const kept = blobs
    .filter((b) => Math.max(b.maxx - b.minx + 1, b.maxy - b.miny + 1) >= MIN_SIZE)
    // reading order: top-to-bottom, then left-to-right (banded by ~rows)
    .sort((a, b) => (Math.abs(a.miny - b.miny) > h * 0.06 ? a.miny - b.miny : a.minx - b.minx))

  console.log(`  ${baseName}: ${kept.length} item(s) found (${blobs.length} blobs, ${w}×${h})`)
  await fs.mkdir(OUT_DIR, { recursive: true })
  let n = 0
  for (const blob of kept) {
    n++
    const png = await cropBlob(data, w, { ...blob, labels })
    const name = `${baseName}-${String(n).padStart(2, '0')}.png`
    await fs.writeFile(path.join(OUT_DIR, name), png)
    console.log(`    ↳ ${name}`)
  }
  return n
}

async function cutout(buf, baseName) {
  const png = await (await toTransparent(buf)).png().toBuffer()
  await fs.mkdir(OUT_DIR, { recursive: true })
  const name = `${baseName}.png`
  await fs.writeFile(path.join(OUT_DIR, name), png)
  console.log(`  ↳ ${name}`)
  return 1
}

async function inputFiles(input) {
  const stat = await fs.stat(input)
  if (stat.isFile()) return [input]
  const entries = await fs.readdir(input, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()))
    .map((e) => path.join(input, e.name))
    .sort()
}

async function main() {
  if (!INPUT) {
    console.error('Usage: node pipeline/extract.mjs <file-or-folder> [--split] [--out dir] [options]')
    process.exit(1)
  }
  let files
  try {
    files = await inputFiles(path.resolve(INPUT))
  } catch {
    console.error(`Input not found: ${INPUT}`)
    process.exit(1)
  }
  if (files.length === 0) {
    console.log('No images found.')
    return
  }
  console.log(`${SPLIT ? 'Splitting' : 'Cutting out'} ${files.length} image(s) → ${OUT_DIR}\n`)
  let total = 0
  for (const file of files) {
    const base = path.basename(file, path.extname(file))
    const buf = await fs.readFile(file)
    total += SPLIT ? await splitSheet(buf, base) : await cutout(buf, base)
  }
  console.log(`\n✓ Wrote ${total} file(s) to ${OUT_DIR}`)
  if (SPLIT) console.log('  Tip: rename that folder into studio/incoming/ to feed it to `npm run ingest`.')
}

main().catch((e) => {
  console.error('\nExtract failed:', e?.message ?? e)
  process.exit(1)
})
