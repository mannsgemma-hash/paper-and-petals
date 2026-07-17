// studio/scripts/clear.mjs
//
// Wipe ALL shop content (items + collections + packs, published AND drafts) from
// Sanity so you can re-ingest reworked art from a clean slate. Keeps `feedback`
// docs and the dataset itself (CORS, tokens, settings are untouched).
//
// Safe by default: with no flag it only COUNTS and deletes nothing.
//
// Usage (from studio/):
//   SANITY_WRITE_TOKEN=...  node scripts/clear.mjs            # show counts, delete nothing
//   SANITY_WRITE_TOKEN=...  node scripts/clear.mjs --yes      # delete items/collections/packs
//   SANITY_WRITE_TOKEN=...  node scripts/clear.mjs --yes --assets   # also delete orphaned image/file assets
//
// On Windows PowerShell, set the token first:  $env:SANITY_WRITE_TOKEN="sk..."

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || 'cv53e819'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN — needed to delete.')
  process.exit(1)
}

const YES = process.argv.includes('--yes')
const ASSETS = process.argv.includes('--assets')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false })
const count = (type) => client.fetch('count(*[_type == $type])', { type })

const [items, collections, packs, imageAssets] = await Promise.all([
  count('item'),
  count('collection'),
  count('pack'),
  count('sanity.imageAsset'),
])

console.log(`Dataset ${projectId}/${dataset}:`)
console.log(`  items:        ${items}`)
console.log(`  collections:  ${collections}`)
console.log(`  packs:        ${packs}`)
console.log(`  image assets: ${imageAssets}${ASSETS ? '  (orphans will be deleted)' : '  (kept unless --assets)'}`)

if (!YES) {
  console.log('\nNothing deleted. Re-run with --yes to actually delete items/collections/packs.')
  process.exit(0)
}

console.log('\nDeleting…')
// Type-based queries match both published (`item-x`) and draft (`drafts.item-x`) docs.
// Delete collections first (they hold references to items).
const delColl = await client.delete({ query: '*[_type == "collection"]' })
console.log(`  collections deleted: ${delColl.results?.length ?? 0}`)
const delItems = await client.delete({ query: '*[_type == "item"]' })
console.log(`  items deleted:       ${delItems.results?.length ?? 0}`)
const delPacks = await client.delete({ query: '*[_type == "pack"]' })
console.log(`  packs deleted:       ${delPacks.results?.length ?? 0}`)

if (ASSETS) {
  // Only delete assets no remaining document references (avoids failing on any
  // asset still used by e.g. a feedback doc).
  const del = await client.delete({
    query: '*[_type in ["sanity.imageAsset", "sanity.fileAsset"] && count(*[references(^._id)]) == 0]',
  })
  console.log(`  orphaned assets deleted: ${del.results?.length ?? 0}`)
}

console.log('\n✓ Cleared. Re-ingest your reworked art with `npm run ingest`.')
console.log('  Tip: also delete studio/pipeline/.ingest-cache.json for a totally fresh metadata pass.')
