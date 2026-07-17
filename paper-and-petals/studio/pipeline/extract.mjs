// studio/pipeline/extract.mjs
//
// Explicit batch tool (see also `npm run prep` for the filename-tag workflow):
//   1. Batch background removal   — folder/file of art → transparent PNGs.
//   2. Sheet splitting (--split)  — a page of many elements → each item saved
//      separately, cut out on its own transparent background.
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

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { IMAGE_EXTS, cutoutPng, splitToPieces } from './lib/image.mjs'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))

const argv = process.argv.slice(2)
const BOOL_FLAGS = new Set(['--split', '--remove-bg', '--no-bg'])
const hasFlag = (f) => argv.includes(f)
const getOpt = (f, d) => {
  const i = argv.indexOf(f)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d
}
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
const OPTS = {
  minSize: Number(getOpt('--min-size', 28)),
  gap: Number(getOpt('--gap', 4)),
  pad: Number(getOpt('--pad', 12)),
  alpha: Number(getOpt('--alpha', 16)),
  maxEdge: Number(getOpt('--max-edge', 2400)),
  forceBg: hasFlag('--remove-bg'),
  noBg: hasFlag('--no-bg'),
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
  await fs.mkdir(OUT_DIR, { recursive: true })
  let total = 0
  for (const file of files) {
    const base = path.basename(file, path.extname(file))
    const buf = await fs.readFile(file)
    if (SPLIT) {
      const { pieces, blobs, width, height } = await splitToPieces(buf, OPTS)
      console.log(`  ${base}: ${pieces.length} item(s) found (${blobs} blobs, ${width}×${height})`)
      for (let n = 0; n < pieces.length; n++) {
        const name = `${base}-${String(n + 1).padStart(2, '0')}.png`
        await fs.writeFile(path.join(OUT_DIR, name), pieces[n])
        console.log(`    ↳ ${name}`)
      }
      total += pieces.length
    } else {
      const png = await cutoutPng(buf, OPTS)
      const name = `${base}.png`
      await fs.writeFile(path.join(OUT_DIR, name), png)
      console.log(`  ↳ ${name}`)
      total += 1
    }
  }
  console.log(`\n✓ Wrote ${total} file(s) to ${OUT_DIR}`)
}

main().catch((e) => {
  console.error('\nExtract failed:', e?.message ?? e)
  process.exit(1)
})
