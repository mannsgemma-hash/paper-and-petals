// studio/pipeline/ingest.mjs
//
// Drop-a-folder content pipeline for Paper & Petals.
//
//   studio/incoming/
//     Spring Meadow/         ← one folder = one COLLECTION (bundle)
//       cover.png            ← optional explicit cover (else the first item is used)
//       collection.json      ← optional overrides { name, palette, price, free, whatYouGet }
//       pressed-rose.png
//       linen-paper.png
//     _free/                 ← special: images here become standalone FREE items (no collection)
//       washi-sage.png
//
// For each image it: removes the background (if needed) → trims + normalises →
// uploads the asset to Sanity → asks Claude (vision) for catalogue metadata →
// creates an `item` DRAFT. Each collection folder also creates a `collection`
// DRAFT referencing its items, with a cover and a "what you get" blurb.
//
// Nothing goes live: everything is written as `drafts.*`, so you review and
// publish in Sanity Studio.
//
// Usage (from studio/):
//   ANTHROPIC_API_KEY=... SANITY_WRITE_TOKEN=... npm run ingest
//   npm run ingest -- --dry-run        # process + metadata only, write to pipeline/out, no upload
//   npm run ingest -- --publish        # create published docs instead of drafts
//   npm run ingest -- --model claude-opus-4-8
//   npm run ingest -- --remove-bg      # force background removal even if the PNG already has alpha
//   npm run ingest -- --no-bg          # never remove background
//   npm run ingest -- --input ./incoming

import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createClient } from '@sanity/client'
import Anthropic from '@anthropic-ai/sdk'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))

// ─── Catalogue vocab (must match src/data/shop.ts + studio/schemas) ─────────────
const CATEGORIES = [
  'papers', 'stickers', 'tape', 'ephemera', 'florals',
  'frames', 'type', 'paint', 'fabric', 'photos', 'details',
]
const TONES = ['sage', 'forest', 'rose', 'mauve', 'blue', 'amber', 'cream', 'oxblood', 'gold']
const MAX_DIM = 1200
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

// ─── Args + env ─────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const hasFlag = (f) => argv.includes(f)
const getOpt = (f, dflt) => {
  const i = argv.indexOf(f)
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt
}

const DRY_RUN = hasFlag('--dry-run')
const PUBLISH = hasFlag('--publish')
const FORCE_BG = hasFlag('--remove-bg')
const NO_BG = hasFlag('--no-bg')
const MODEL = getOpt('--model', 'claude-haiku-4-5')
const INPUT_DIR = path.resolve(getOpt('--input', path.join(SCRIPT_DIR, '..', 'incoming')))
const OUT_DIR = path.join(SCRIPT_DIR, 'out')

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'cv53e819'
const DATASET = process.env.SANITY_DATASET || 'production'
const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

// ─── Clients ────────────────────────────────────────────────────────────────────
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null
const sanity = !DRY_RUN
  ? createClient({ projectId: PROJECT_ID, dataset: DATASET, token: SANITY_TOKEN, apiVersion: '2024-10-01', useCdn: false })
  : null

// ─── Helpers ────────────────────────────────────────────────────────────────────
const slug = (s) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48)
const hash4 = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 4)
const idFor = (name, sourceKey) => `${slug(name) || 'item'}-${hash4(sourceKey)}`
const docId = (id) => (PUBLISH ? id : `drafts.${id}`)

let bgRemover // lazily-loaded optional dependency
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

/** Normalise an already-prepared image → cap size → PNG buffer.
 *  Background removal/splitting is `extract`'s job and is NOT done here, so
 *  full-page opaque papers are kept whole. Pass --remove-bg to force it. */
async function processImage(buf, filename) {
  let working = buf
  if (FORCE_BG) {
    const remove = await loadBgRemover()
    if (remove) {
      try {
        // Hand the remover a real PNG Blob with an explicit type — a bare buffer
        // gets wrapped as a typeless blob and fails format detection.
        const pngInput = await sharp(working).png().toBuffer()
        const result = await remove(new Blob([pngInput], { type: 'image/png' }))
        working = Buffer.from(await result.arrayBuffer())
        console.log('  · removed background')
      } catch (e) {
        console.warn(`  ⚠ background removal failed (${e?.message ?? e}) — using original`)
      }
    }
  }
  const meta = await sharp(working).metadata()
  let img = sharp(working).ensureAlpha()
  // Only tighten genuine cut-outs (images with transparency). Opaque full-page
  // papers have no transparent margin and must stay full-bleed — don't trim them.
  if (meta.hasAlpha) {
    try {
      img = sharp(await img.trim().png().toBuffer())
    } catch {
      /* uniform image — nothing to trim */
    }
  }
  return img
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true })
    .png()
    .toBuffer()
}

/** Pull the first JSON object out of a model reply (tolerates prose / code fences). */
function parseJson(resp) {
  const text = resp.content.map((b) => (b.type === 'text' ? b.text : '')).join('')
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1] : text
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start < 0 || end < 0) throw new Error(`no JSON in model reply: ${text.slice(0, 120)}`)
  return JSON.parse(body.slice(start, end + 1))
}

async function itemMetadata(pngBuf, brandVoice, hint) {
  const instruction =
    `Catalogue this single scrapbook element.${hint ? ` Context: ${hint}.` : ''}\n\n` +
    `Reply with ONLY a JSON object:\n` +
    `{ "name": string, "category": one of ${JSON.stringify(CATEGORIES)}, ` +
    `"tone": one of ${JSON.stringify(TONES)}, "glyph": a Feather icon name, "description": string }`
  const resp = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: brandVoice,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/png', data: pngBuf.toString('base64') } },
          { type: 'text', text: instruction },
        ],
      },
    ],
  })
  const m = parseJson(resp)
  if (!CATEGORIES.includes(m.category)) m.category = 'details'
  if (!TONES.includes(m.tone)) m.tone = 'sage'
  return m
}

async function collectionMetadata(brandVoice, folderName, members) {
  const list = members.map((m) => `- ${m.name} (${m.category}): ${m.description}`).join('\n')
  const instruction =
    `Write collection (bundle) metadata for a Paper & Petals collection named ` +
    `"${folderName}" containing these ${members.length} pieces:\n${list}\n\n` +
    `Reply with ONLY a JSON object:\n` +
    `{ "name": a warm 1–4 word title (keep "${folderName}" if already good), ` +
    `"palette": one of ${JSON.stringify(TONES)}, ` +
    `"whatYouGet": ONE inviting sentence (no "this is", no emoji), ` +
    `"suggestedPrice": a USD number 1.99–6.99 scaled to the piece count, ending in .99 }`
  const resp = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 400,
    system: brandVoice,
    messages: [{ role: 'user', content: [{ type: 'text', text: instruction }] }],
  })
  const m = parseJson(resp)
  if (!TONES.includes(m.palette)) m.palette = members[0]?.tone ?? 'sage'
  return m
}

async function uploadAsset(pngBuf, filename) {
  const asset = await sanity.assets.upload('image', pngBuf, { filename, contentType: 'image/png' })
  return asset._id
}

function imageField(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

// ─── Run ────────────────────────────────────────────────────────────────────────
async function listImages(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile() && IMAGE_EXTS.has(path.extname(e.name).toLowerCase()) && !e.name.startsWith('cover.'))
    .map((e) => e.name)
    .sort()
}

async function readOverrides(dir) {
  try {
    return JSON.parse(await fs.readFile(path.join(dir, 'collection.json'), 'utf8'))
  } catch {
    return {}
  }
}

async function processOneImage(dir, filename, { free, brandVoice, hint }) {
  console.log(`  • ${filename}`)
  const raw = await fs.readFile(path.join(dir, filename))
  const png = await processImage(raw, filename)
  const meta = await itemMetadata(png, brandVoice, hint)
  const id = idFor(meta.name, `${dir}/${filename}`)

  if (DRY_RUN) {
    await fs.mkdir(OUT_DIR, { recursive: true })
    await fs.writeFile(path.join(OUT_DIR, `item-${id}.png`), png)
    return { id, meta, assetId: null, free }
  }

  const assetId = await uploadAsset(png, `${id}.png`)
  const doc = {
    _id: docId(`item-${id}`),
    _type: 'item',
    name: meta.name,
    category: meta.category,
    free,
    tone: meta.tone,
    glyphFallback: meta.glyph,
    description: meta.description,
    asset: imageField(assetId),
  }
  await sanity.createOrReplace(doc)
  console.log(`    ↳ ${doc._id}  [${meta.category} · ${meta.tone}]  "${meta.description}"`)
  return { id, meta, assetId, free }
}

async function processCollectionFolder(dir, folderName, brandVoice) {
  console.log(`\n📦 Collection: ${folderName}`)
  const overrides = await readOverrides(dir)
  const files = await listImages(dir)
  if (files.length === 0) {
    console.log('  (no images — skipped)')
    return
  }

  const items = []
  for (const f of files) {
    try {
      items.push(await processOneImage(dir, f, { free: overrides.free === true, brandVoice, hint: `part of the "${folderName}" collection` }))
    } catch (e) {
      console.warn(`    ⚠ skipped ${f}: ${e?.message ?? e}`)
    }
  }
  if (items.length === 0) {
    console.log('  (no usable images — collection skipped)')
    return
  }

  // Collection-level metadata (overrides win; failures fall back to defaults).
  let ai = {}
  try {
    if (anthropic) ai = await collectionMetadata(brandVoice, folderName, items.map((i) => i.meta))
  } catch (e) {
    console.warn(`  ⚠ collection metadata failed (${e?.message ?? e}) — using folder name + defaults`)
  }
  const name = overrides.name ?? ai.name ?? folderName
  const palette = overrides.palette ?? ai.palette ?? items[0]?.meta.tone ?? 'sage'
  const whatYouGet = overrides.whatYouGet ?? ai.whatYouGet ?? ''
  const price = overrides.price ?? ai.suggestedPrice ?? 4.99
  const free = overrides.free === true

  // Cover: explicit cover.* file → upload; else reuse the first item's asset.
  let coverAssetId = items[0]?.assetId ?? null
  const coverFile = (await fs.readdir(dir)).find((n) => n.toLowerCase().startsWith('cover.'))
  if (coverFile && !DRY_RUN) {
    const coverPng = await processImage(await fs.readFile(path.join(dir, coverFile)), coverFile)
    coverAssetId = await uploadAsset(coverPng, `collection-${slug(name)}-cover.png`)
  }

  if (DRY_RUN) {
    await fs.mkdir(OUT_DIR, { recursive: true })
    await fs.writeFile(
      path.join(OUT_DIR, `collection-${slug(folderName)}.json`),
      JSON.stringify({ name, palette, price, free, whatYouGet, pieceCount: items.length, items: items.map((i) => ({ id: `item-${i.id}`, ...i.meta })) }, null, 2),
    )
    console.log(`  ↳ (dry-run) ${name} · ${items.length} pieces · $${price} · ${palette}`)
    return
  }

  const doc = {
    _id: docId(`collection-${slug(name)}`),
    _type: 'collection',
    name,
    palette,
    free,
    price,
    whatYouGet,
    cover: coverAssetId ? imageField(coverAssetId) : undefined,
    // Weak refs so the draft validates before the member items are published.
    items: items.map((i) => ({ _type: 'reference', _key: i.id, _ref: `item-${i.id}`, _weak: true })),
  }
  await sanity.createOrReplace(doc)
  console.log(`  ↳ ${doc._id}  ${items.length} pieces · $${price} · ${palette}`)
}

async function processFreeFolder(dir, brandVoice) {
  console.log(`\n🆓 Free items`)
  const files = await listImages(dir)
  for (const f of files) {
    try {
      await processOneImage(dir, f, { free: true, brandVoice, hint: 'a free starter-set piece' })
    } catch (e) {
      console.warn(`    ⚠ skipped ${f}: ${e?.message ?? e}`)
    }
  }
}

async function main() {
  if (!anthropic) {
    console.error('Missing ANTHROPIC_API_KEY — needed for metadata generation.')
    process.exit(1)
  }
  if (!DRY_RUN && !SANITY_TOKEN) {
    console.error('Missing SANITY_WRITE_TOKEN — needed to upload (or use --dry-run).')
    process.exit(1)
  }

  let brandVoice = ''
  try {
    brandVoice = await fs.readFile(path.join(SCRIPT_DIR, 'brand-voice.md'), 'utf8')
  } catch {
    console.warn('No brand-voice.md found — descriptions will use the default voice.')
  }

  let folders
  try {
    folders = (await fs.readdir(INPUT_DIR, { withFileTypes: true })).filter((e) => e.isDirectory())
  } catch {
    console.error(`Input folder not found: ${INPUT_DIR}\nCreate it and drop collection folders inside.`)
    process.exit(1)
  }
  if (folders.length === 0) {
    console.log(`Nothing to ingest in ${INPUT_DIR}.`)
    return
  }

  console.log(`Ingesting from ${INPUT_DIR}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no upload)' : PUBLISH ? 'PUBLISH (live docs)' : 'DRAFTS (review in Studio)'} · model: ${MODEL}\n`)

  for (const folder of folders) {
    const dir = path.join(INPUT_DIR, folder.name)
    if (folder.name === '_free') await processFreeFolder(dir, brandVoice)
    else if (folder.name === '_done' || folder.name.startsWith('.')) continue
    else await processCollectionFolder(dir, folder.name, brandVoice)
  }

  console.log(`\n✓ Done.${DRY_RUN ? ` Review metadata in ${OUT_DIR}` : ' Review and publish the drafts in Sanity Studio.'}`)
}

main().catch((e) => {
  console.error('\nIngest failed:', e?.message ?? e)
  process.exit(1)
})
