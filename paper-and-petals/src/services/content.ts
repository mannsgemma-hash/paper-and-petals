import { sanity } from '../lib/sanity'
import {
  SHOP_CATALOGUE,
  ShopItem,
  Collection,
  CollectionItemRef,
} from '../data/shop'

// ─── Live shop catalogue ────────────────────────────────────────────────────────
// New items and collections appear here as they are published in Sanity. Content
// is sold as collections (bundles); items carry only a `free` flag. The store is
// the single source of new content — there is no daily pack.

const LIVE_ITEMS_QUERY = `*[_type == "item" && (!defined(publishAt) || publishAt <= now())] | order(category asc, name asc) {
  _id,
  name,
  category,
  free,
  tier,
  publishAt,
  description,
  glyphFallback,
  tone,
  "assetUrl": asset.asset->url
}`

const LIVE_COLLECTIONS_QUERY = `*[_type == "collection" && (!defined(publishAt) || publishAt <= now())] | order(publishAt desc, name asc) {
  _id,
  name,
  palette,
  price,
  free,
  whatYouGet,
  publishAt,
  "coverUrl": cover.asset->url,
  "items": items[]->{ _id, name, category, glyphFallback, tone, "assetUrl": asset.asset->url, "printUrl": printAsset.asset->url }
}`

export interface SanityItem {
  _id: string
  name: string
  category: string
  /** New free-tier flag. */
  free?: boolean
  /** Legacy tier — bridged to `free` until the dataset is reseeded. */
  tier?: 'free' | 'pack' | 'catalogue' | 'paid'
  description?: string
  glyphFallback?: string
  tone?: string
  assetUrl?: string
}

export interface SanityCollectionItem {
  _id: string
  name: string
  category: string
  glyphFallback?: string
  tone?: string
  assetUrl?: string
  printUrl?: string
}

export interface SanityCollection {
  _id: string
  name: string
  palette?: string
  price?: number
  free?: boolean
  whatYouGet?: string
  publishAt?: string
  coverUrl?: string
  items?: (SanityCollectionItem | null)[]
}

const stripItemId = (id: string) => id.replace(/^item-/, '')
const stripCollectionId = (id: string) => id.replace(/^collection-/, '')

export async function fetchLiveItems(): Promise<SanityItem[]> {
  try {
    return await sanity.fetch(LIVE_ITEMS_QUERY)
  } catch {
    return []
  }
}

export async function fetchLiveCollections(): Promise<SanityCollection[]> {
  try {
    return await sanity.fetch(LIVE_COLLECTIONS_QUERY)
  } catch {
    return []
  }
}

function collectionItemToRef(ci: SanityCollectionItem): CollectionItemRef {
  const id = stripItemId(ci._id)
  const staticMatch = SHOP_CATALOGUE.find((s) => s.id === id)
  return {
    id,
    name: ci.name,
    category: ci.category as ShopItem['category'],
    tone: (ci.tone ?? staticMatch?.tone ?? 'sage') as ShopItem['tone'],
    glyph: (ci.glyphFallback ?? staticMatch?.glyph ?? 'package') as any,
    flowerAsset: ci.assetUrl ? ({ uri: ci.assetUrl } as any) : staticMatch?.flowerAsset,
    printUrl: ci.printUrl,
  }
}

export function sanityCollectionToCollection(sc: SanityCollection): Collection {
  const seen = new Set<string>()
  const items = (sc.items ?? [])
    .filter((ci): ci is SanityCollectionItem => !!ci)
    .map(collectionItemToRef)
    // De-dupe: a collection can reference the same piece twice (duplicate art or
    // a repeated Studio reference). Keep the first so keys/counts stay correct.
    .filter((ref) => (seen.has(ref.id) ? false : (seen.add(ref.id), true)))
  return {
    id: stripCollectionId(sc._id),
    name: sc.name,
    palette: (sc.palette ?? 'sage') as Collection['palette'],
    cover: sc.coverUrl ? ({ uri: sc.coverUrl } as any) : undefined,
    whatYouGet: sc.whatYouGet ?? '',
    price: sc.price ?? 0,
    free: !!sc.free,
    isNew: false,
    pieceCount: items.length,
    items,
  }
}

interface ItemContext {
  collectionIds: string[]
  freeFromCollection: boolean
}

export function sanityItemToShopItem(si: SanityItem, ctx: ItemContext): ShopItem {
  const id = stripItemId(si._id)
  const staticMatch = SHOP_CATALOGUE.find((s) => s.id === id)
  // Bridge legacy `tier === 'free'` until the dataset is reseeded with `free`.
  const free = si.free === true || si.tier === 'free' || ctx.freeFromCollection
  return {
    id,
    name: si.name,
    category: si.category as ShopItem['category'],
    tone: (si.tone ?? staticMatch?.tone ?? 'sage') as ShopItem['tone'],
    glyph: (si.glyphFallback ?? staticMatch?.glyph ?? 'package') as any,
    desc: si.description ?? staticMatch?.desc ?? '',
    free,
    collectionIds: ctx.collectionIds,
    isNew: false,
    flowerAsset: si.assetUrl ? ({ uri: si.assetUrl } as any) : staticMatch?.flowerAsset,
  }
}

export interface Catalogue {
  items: ShopItem[]
  collections: Collection[]
}

/**
 * Fetch items + collections together and derive each item's `collectionIds` and
 * `free` flag by inverting the collection→items relation. Fails soft: if either
 * query returns empty, that half falls back to the static catalogue at the
 * call-site (callers only replace state when the array is non-empty).
 */
export async function fetchCatalogue(): Promise<Catalogue> {
  const [rawItems, rawCollections] = await Promise.all([fetchLiveItems(), fetchLiveCollections()])

  const collections = rawCollections.map(sanityCollectionToCollection)

  // Invert: itemId → [collectionId], plus the set of items in any free collection.
  const itemToCollections: Record<string, string[]> = {}
  const freeFromCollection = new Set<string>()
  for (const col of collections) {
    for (const ref of col.items) {
      ;(itemToCollections[ref.id] ??= []).push(col.id)
      if (col.free) freeFromCollection.add(ref.id)
    }
  }

  const items = rawItems.map((si) => {
    const id = stripItemId(si._id)
    return sanityItemToShopItem(si, {
      collectionIds: itemToCollections[id] ?? [],
      freeFromCollection: freeFromCollection.has(id),
    })
  })

  return { items, collections }
}
