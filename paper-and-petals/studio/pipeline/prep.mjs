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
  // Absolute bridge distance in working pixels — exactly the "gap≈Npx" a run
  // prints. Overrides --gap, so you can dial a sheet in without the arithmetic.
  gapPx: argv.includes('--gap-px') ? Number(getOpt('--gap-px', 0)) : null,
  alpha: Number(getOpt('--alpha', 16)),
  minSize: Number(getOpt('--min-size', 28)),
  pad: Number(getOpt('--pad', 12)),
  // Pieces are cut from the sheet at this resolution, so it sets the detail the
  // art keeps forever: a 6-up page capped at 2400px yields ~800px pieces, which
  // look soft in the editor. gap/min-size/pad are scaled to a 2400 baseline, so
  // raising this keeps detail WITHOUT changing how items group.
  maxEdge: Number(getOpt('--max-edge', 4000)),
}
const UNDO = argv.includes('--undo')
const YES = argv.includes('--yes')

/**
 * Move the processed original out of ingest's sight, preserving it. The stash
 * mirrors the folder's path under incoming/ (…/_originals/Theme/Papers/x.png)
 * so two themes that both have a "Papers" folder can't collide, and --undo can
 * put every original back exactly where it came from.
 */
async function stashOriginal(dir, filename) {
  const rel = path.relative(INPUT_DIR, dir)
  const destDir = path.join(ORIGINALS_DIR, rel)
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
        const { pieces, blobs, width, height, effGap } = await splitToPieces(buf, OPTS)
        console.log(
          `  ✂ ${filename}: ${pieces.length} piece(s) (${blobs} blobs, ${width}×${height}, gap≈${effGap}px)`,
        )
        for (let n = 0; n < pieces.length; n++) {
          const name = `${base}-${String(n + 1).padStart(2, '0')}.png`
          await fs.writeFile(path.join(dir, name), pieces[n])
          console.log(`    ↳ ${name}`)
        }
        // Keep the whole page next to its pieces as "<base>.sheet.<ext>": ingest
        // attaches it as every piece's PRINT asset, so the download people get is
        // the full sheet (e.g. a 6-up fussy-cut page), not the individual cutout.
        // Ingest never treats .sheet files as items.
        const sheetName = `${base}.sheet${path.extname(filename).toLowerCase()}`
        await fs.writeFile(path.join(dir, sheetName), buf)
        console.log(`    ↳ ${sheetName} (printable full page)`)
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

/**
 * Undo a previous prep: put every stashed original back where it came from and
 * remove the files that were derived from it, so the run can be repeated with
 * different settings. Derived names are deterministic:
 *   teapots_split.png → teapots-01.png … teapots-NN.png + teapots.sheet.png
 *   old-letter_cut.png → old-letter.png
 * Only those are removed — hand-made art sitting in the same folder is untouched.
 */
async function undoPrep() {
  let stashed
  try {
    stashed = await walkFiles(ORIGINALS_DIR)
  } catch {
    stashed = []
  }
  if (stashed.length === 0) {
    console.log(`Nothing to undo — no originals stashed in ${ORIGINALS_DIR}`)
    return
  }

  const plan = []
  for (const abs of stashed) {
    const rel = path.relative(ORIGINALS_DIR, abs)
    const destDir = path.join(INPUT_DIR, path.dirname(rel))
    // "name (2).png" came from a repeat prep of "name.png".
    const filename = path.basename(rel).replace(/ \(\d+\)(\.[^.]+)$/, '$1')
    const base = cleanBase(filename)
    let derived = []
    try {
      derived = (await fs.readdir(destDir, { withFileTypes: true }))
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((n) => {
          const stem = n.replace(/\.[^.]+$/, '')
          return (
            stem === base || // <base>.png from a _cut
            stem === `${base}.sheet` || // the kept full page
            new RegExp(`^${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d{2,}$`).test(stem) // <base>-01…
          )
        })
    } catch {
      /* folder gone — just restore the original */
    }
    plan.push({ abs, destDir, filename, derived })
  }

  const totalDerived = plan.reduce((n, p) => n + p.derived.length, 0)
  console.log(`Undo prep under ${INPUT_DIR}`)
  for (const p of plan) {
    console.log(`  ↩ ${path.relative(INPUT_DIR, path.join(p.destDir, p.filename))}`)
    if (p.derived.length) console.log(`      removes ${p.derived.length}: ${p.derived.slice(0, 4).join(', ')}${p.derived.length > 4 ? ', …' : ''}`)
  }
  console.log(`\n${plan.length} original(s) to restore · ${totalDerived} derived file(s) to delete`)
  if (!YES) {
    console.log('\nNothing changed. Re-run with --undo --yes to actually do it.')
    return
  }

  let restored = 0
  let deleted = 0
  for (const p of plan) {
    try {
      await fs.mkdir(p.destDir, { recursive: true })
      for (const name of p.derived) {
        await fs.rm(path.join(p.destDir, name), { force: true })
        deleted++
      }
      await fs.rename(p.abs, path.join(p.destDir, p.filename))
      restored++
    } catch (e) {
      console.warn(`  ⚠ ${p.filename}: ${e?.message ?? e}`)
    }
  }
  // Clean up the now-empty stash tree (best effort).
  try {
    await fs.rm(ORIGINALS_DIR, { recursive: true, force: true })
  } catch {
    /* leave it */
  }
  console.log(`\n✓ Restored ${restored} original(s), deleted ${deleted} derived file(s).`)
  console.log('  Re-run `npm run prep` with your new settings.')
}

/** Every file under a directory tree, recursively. */
async function walkFiles(dir) {
  const out = []
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walkFiles(p)))
    else if (e.isFile()) out.push(p)
  }
  return out
}

async function main() {
  if (UNDO) {
    await undoPrep()
    return
  }
  let folders
  try {
    folders = (await fs.readdir(INPUT_DIR, { withFileTypes: true })).filter((e) => e.isDirectory())
  } catch {
    console.error(`Input folder not found: ${INPUT_DIR}`)
    process.exit(1)
  }

  console.log(`Prepping tagged art under ${INPUT_DIR}`)
  console.log(
    `(${OPTS.gapPx != null ? `gap-px ${OPTS.gapPx} (absolute)` : `gap ${OPTS.gap}`} · alpha ${OPTS.alpha} · min-size ${OPTS.minSize} · max-edge ${OPTS.maxEdge})`,
  )

  const totals = { split: 0, cut: 0, pieces: 0 }
  const add = (s) => {
    totals.split += s.split
    totals.cut += s.cut
    totals.pieces += s.pieces
  }
  for (const folder of folders) {
    // Collections + _free are prepped; _originals/_done/dot-folders are not.
    if (folder.name.startsWith('.') || (folder.name.startsWith('_') && folder.name !== '_free')) continue
    const dir = path.join(INPUT_DIR, folder.name)
    add(await prepFolder(dir, folder.name))

    // A collection may group its art into category subfolders ("Papers",
    // "Stickers", …) — prep those too, in place, same as the root.
    let subs = []
    try {
      subs = (await fs.readdir(dir, { withFileTypes: true })).filter(
        (e) => e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('_'),
      )
    } catch {
      /* no subfolders */
    }
    for (const sub of subs) {
      add(await prepFolder(path.join(dir, sub.name), `${folder.name} / ${sub.name}`))
    }
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
