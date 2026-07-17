// studio/pipeline/prep.mjs
//
// Tag-driven prep: drop raw art straight into its collection folder under
// incoming/, tag the FILENAME with what it needs, and run `npm run prep`.
// Files are processed IN PLACE (results land in the same folder) and the
// originals are moved to incoming/_originals/ (never deleted).
//
//   my-teapots_split.png   → sheet: background removed (if needed) + split into
//                            my-teapots-01.png, -02.png, … in the same folder
//   old-letter_cut.png     → single element: background removed → old-letter.png
//   anything else          → left alone (already-ready art)
//
// ("-split"/"-cut" also work; case-insensitive.)
//
// Usage (from studio/):
//   npm run prep                      # process every tagged file under incoming/
//   npm run prep -- --gap 10          # override the split gap for this run
//   npm run prep -- --input <dir>     # prep a different folder tree
//
// Options (apply to all tagged files in the run):
//   --gap <px>       bridge gaps so one item doesn't split in two (default 0 —
//                    tuned for grid sheets; raise if an item loses a piece)
//   --alpha <0-255>  alpha cutoff that counts as "ink" (default 16; raise to ~70
//                    if soft edges glue neighbouring items together)
//   --min-size <px>  ignore blobs smaller than this (default 28)
//   --pad <px>       transparent padding around pieces (default 12)
//   --max-edge <px>  working resolution cap (default 2400)

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { IMAGE_EXTS, fileTag, cleanBase, cutoutPng, splitToPieces } from './lib/image.mjs'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))

const argv = process.argv.slice(2)
const getOpt = (f, d) => {
  const i = argv.indexOf(f)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d
}

const INPUT_DIR = path.resolve(getOpt('--input', path.join(SCRIPT_DIR, '..', 'incoming')))
const ORIGINALS_DIR = path.join(INPUT_DIR, '_originals')
const OPTS = {
  gap: Number(getOpt('--gap', 0)),
  alpha: Number(getOpt('--alpha', 16)),
  minSize: Number(getOpt('--min-size', 28)),
  pad: Number(getOpt('--pad', 12)),
  maxEdge: Number(getOpt('--max-edge', 2400)),
}

/** Move the processed original out of ingest's sight, preserving it. */
async function stashOriginal(dir, filename) {
  const destDir = path.join(ORIGINALS_DIR, path.basename(dir))
  await fs.mkdir(destDir, { recursive: true })
  let dest = path.join(destDir, filename)
  // Never overwrite a previously stashed original with the same name.
  for (let n = 2; ; n++) {
    try {
      await fs.access(dest)
      const ext = path.extname(filename)
      dest = path.join(destDir, `${path.basename(filename, ext)} (${n})${ext}`)
    } catch {
      break
    }
  }
  await fs.rename(path.join(dir, filename), dest)
}

async function prepFolder(dir, folderName) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return { split: 0, cut: 0, pieces: 0 }
  }
  const tagged = entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()) && fileTag(e.name))
    .map((e) => e.name)
    .sort()
  if (tagged.length === 0) return { split: 0, cut: 0, pieces: 0 }

  console.log(`\n📂 ${folderName}`)
  const stats = { split: 0, cut: 0, pieces: 0 }
  for (const filename of tagged) {
    const tag = fileTag(filename)
    const base = cleanBase(filename)
    const buf = await fs.readFile(path.join(dir, filename))
    try {
      if (tag === 'split') {
        const { pieces, blobs, width, height } = await splitToPieces(buf, OPTS)
        console.log(`  ✂ ${filename}: ${pieces.length} piece(s) (${blobs} blobs, ${width}×${height})`)
        for (let n = 0; n < pieces.length; n++) {
          const name = `${base}-${String(n + 1).padStart(2, '0')}.png`
          await fs.writeFile(path.join(dir, name), pieces[n])
          console.log(`    ↳ ${name}`)
        }
        stats.split++
        stats.pieces += pieces.length
      } else {
        const png = await cutoutPng(buf, { forceBg: true, maxEdge: OPTS.maxEdge })
        await fs.writeFile(path.join(dir, `${base}.png`), png)
        console.log(`  ✂ ${filename} → ${base}.png`)
        stats.cut++
        stats.pieces += 1
      }
      await stashOriginal(dir, filename)
    } catch (e) {
      console.warn(`  ⚠ ${filename} failed (${e?.message ?? e}) — left in place`)
    }
  }
  return stats
}

async function main() {
  let folders
  try {
    folders = (await fs.readdir(INPUT_DIR, { withFileTypes: true })).filter((e) => e.isDirectory())
  } catch {
    console.error(`Input folder not found: ${INPUT_DIR}`)
    process.exit(1)
  }

  console.log(`Prepping tagged art under ${INPUT_DIR}`)
  console.log(`(gap ${OPTS.gap} · alpha ${OPTS.alpha} · min-size ${OPTS.minSize})`)

  const totals = { split: 0, cut: 0, pieces: 0 }
  for (const folder of folders) {
    // Collections + _free are prepped; _originals/_done/dot-folders are not.
    if (folder.name.startsWith('.') || (folder.name.startsWith('_') && folder.name !== '_free')) continue
    const s = await prepFolder(path.join(INPUT_DIR, folder.name), folder.name)
    totals.split += s.split
    totals.cut += s.cut
    totals.pieces += s.pieces
  }

  if (totals.split + totals.cut === 0) {
    console.log('\nNothing tagged — name sheets "…_split.png" and cut-outs "…_cut.png".')
  } else {
    console.log(
      `\n✓ Prepped ${totals.split} sheet(s) + ${totals.cut} cut-out(s) → ${totals.pieces} piece(s).`,
    )
    console.log(`  Originals kept in ${ORIGINALS_DIR}`)
    console.log('  Review the pieces (delete any junk), then run `npm run ingest`.')
  }
}

main().catch((e) => {
  console.error('\nPrep failed:', e?.message ?? e)
  process.exit(1)
})
