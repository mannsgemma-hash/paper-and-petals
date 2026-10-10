// studio/scripts/prune-orphans.mjs
//
// Delete every item no collection points at.
//
// The catalogue is sold as collections, so an item belonging to none of them is
// invisible in the shop and unreachable in the editor — except for Studio
// subscribers, who see every item there is, and for anything flagged `free`,
// which shows in the shop's free grid regardless. So they aren't merely untidy;
// they leak.
//
// They accumulate on their own: re-cutting a sheet gives its pieces new content
// hashes and so new documents, while the previous run's stay published. Ingest
// only clears those for a collection it re-processes (`--prune`), which is no
// help once the art has been moved out of `incoming/`.
//
// Safe by default: with no flag it only LISTS. Deletes exactly what it listed —
// by id, not by re-running the query — so nothing can change underneath it.
//
// Usage (from studio/):
//   node scripts/prune-orphans.mjs                 # list, delete nothing
//   node scripts/prune-orphans.mjs --yes           # delete them
//   node scripts/prune-orphans.mjs --yes --assets  # also drop the images they held
//   node scripts/prune-orphans.mjs --keep-free     # spare loose free pieces
//
// On Windows PowerShell:  $env:SANITY_WRITE_TOKEN="sk..."

import { createClient } from '@sanity/client'
import { assertSanityToken, explainSanityError } from '../pipeline/lib/auth.mjs'
import { findOrphans, ITEMS_QUERY, COLLECTION_REFS_QUERY } from '../pipeline/lib/orphans.mjs'

const projectId = process.env.SANITY_PROJECT_ID || 'cv53e819'
const dataset = process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN
assertSanityToken(token, 'delete items')

const YES = process.argv.includes('--yes')
const ASSETS = process.argv.includes('--assets')
const KEEP_FREE = process.argv.includes('--keep-free')

const client = createClient({ projectId, dataset, token, apiVersion: '2024-10-01', useCdn: false })

/** Delete in batches — one transaction per 100 so a big sweep doesn't time out. */
async function deleteIds(ids) {
  let done = 0
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100)
    const tx = batch.reduce((t, id) => t.delete(id).delete(`drafts.${id}`), client.transaction())
    await tx.commit({ visibility: 'async' })
    done += batch.length
    process.stdout.write(`\r  deleted ${done}/${ids.length}…`)
  }
  process.stdout.write('\n')
}

async function main() {
  console.log(`Dataset ${projectId}/${dataset}\n`)

  const [items, collections] = await Promise.all([
    client.fetch(ITEMS_QUERY),
    client.fetch(COLLECTION_REFS_QUERY),
  ])

  const orphans = findOrphans(items, collections)
  const loose = orphans.filter((o) => o.free === true)
  const stranded = orphans.filter((o) => o.free !== true)
  const doomed = KEEP_FREE ? stranded : orphans

  console.log(`${items.length} item(s), ${collections.length} collection(s).`)
  console.log(`${items.length - orphans.length} belong to a collection.\n`)

  if (orphans.length === 0) {
    console.log('✓ Nothing to prune — every item belongs to a collection.\n')
    return
  }

  console.log(`── In no collection (${stranded.length}) ──`)
  for (const o of stranded.slice(0, 15)) console.log(`  · ${o._id}  (${o.name ?? 'unnamed'})`)
  if (stranded.length > 15) console.log(`  · …and ${stranded.length - 15} more`)

  if (loose.length) {
    console.log(`\n── In no collection, but flagged FREE (${loose.length}) ──`)
    for (const o of loose.slice(0, 15)) console.log(`  · ${o._id}  (${o.name ?? 'unnamed'})`)
    if (loose.length > 15) console.log(`  · …and ${loose.length - 15} more`)
    console.log(
      KEEP_FREE
        ? '\n  Kept (--keep-free). These are standalone free pieces from loose files in _free/.'
        : '\n  These are standalone free pieces from loose files in _free/. If you sell free\n' +
            '  art as whole collections, they are leftovers and should go. --keep-free spares them.',
    )
  }

  if (!YES) {
    console.log(`\n${doomed.length} item(s) would be deleted. Nothing changed.`)
    console.log('Re-run with --yes to delete them' + (ASSETS ? '' : ', and --assets to drop their images too') + '.\n')
    return
  }

  console.log(`\nDeleting ${doomed.length} item(s)…`)
  await deleteIds(doomed.map((o) => o._id))

  if (ASSETS) {
    // Only assets nothing references at all — an image shared with a document
    // that is staying must survive.
    console.log('Deleting images nothing references…')
    const del = await client.delete({
      query:
        '*[_type in ["sanity.imageAsset", "sanity.fileAsset"] && count(*[references(^._id)]) == 0]',
    })
    console.log(`  ${del.results?.length ?? 0} asset(s) deleted`)
  } else {
    console.log('\nTheir images are still in the dataset. --assets removes the unreferenced ones.')
  }

  console.log('\n✓ Done. Run `npm run check-types` to confirm.\n')
}

main().catch((err) => explainSanityError(err, projectId, { didWork: YES }))
