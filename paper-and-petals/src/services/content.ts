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
  productId,
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
  /** Explicit store product id set in Sanity; overrides the derived one. */
  productId?: string
  whatYouGet?: string
  publishAt?: string
  coverUrl?: string
  items?: (SanityCollectionItem | null)[]
}

const stripItemId = (id: string) => String(id ?? '').replace(/^item-/, '')
const stripCollectionId = (id: string) => String(id ?? '').replace(/^collection-/, '')

// ─── Coercion ───────────────────────────────────────────────────────────────────
// Sanity's content lake is schemaless: the Studio schema constrains what the
// EDITOR writes, not what the API accepts. Anything that puts documents in
// another way — the ingest pipeline, a script, a hand-rolled patch — can store a
// field with the wrong type, and a `price` that arrives as the string "5.99"
// turns `price.toFixed(2)` into a TypeError that takes the whole screen down.
//
// So nothing downstream is allowed to trust a raw Sanity value: every field is
// coerced here, at the single point where external data enters the app.

/** A finite number, or the fallback — accepts numeric strings like "5.99". */
const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v.replace(/[^0-9.-]/g, '')) : NaN
  return Number.isFinite(n) ? n : fallback
}

/** A non-empty trimmed string, or the fallback. */
const str = (v: unknown, fallback = ''): string => {
  if (typeof v === 'string') return v.trim() || fallback
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return fallback
}

/** A usable remote image source, or undefined — never a half-built object. */
const imageSource = (url: unknown): { uri: string } | undefined => {
  const u = str(url)
  return u ? { uri: u } : undefined
}

export async function fetchLiveItems(): Promise<SanityItem[] | null> {
  try {
    return await sanity.fetch(LIVE_ITEMS_QUERY)
  } catch {
    return null
  }
}

export async function fetchLiveCollections(): Promise<SanityCollection[] | null> {
  try {
    return await sanity.fetch(LIVE_COLLECTIONS_QUERY)
  } catch {
    return null
  }
}

function collectionItemToRef(ci: SanityCollectionItem): CollectionItemRef {
  const id = stripItemId(ci._id)
  const staticMatch = SHOP_CATALOGUE.find((s) => s.id === id)
  return {
    id,
    name: str(ci.name, 'Untitled piece'),
    category: str(ci.category, 'details') as ShopItem['category'],
    tone: str(ci.tone, staticMatch?.tone ?? 'sage') as ShopItem['tone'],
    glyph: str(ci.glyphFallback, staticMatch?.glyph ?? 'package') as any,
    flowerAsset: (imageSource(ci.assetUrl) ?? staticMatch?.flowerAsset) as any,
    printUrl: str(ci.printUrl) || undefined,
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
    name: str(sc.name, 'Untitled collection'),
    palette: str(sc.palette, 'sage') as Collection['palette'],
    cover: imageSource(sc.coverUrl) as any,
    whatYouGet: str(sc.whatYouGet),
    price: num(sc.price, 0),
    productId: str(sc.productId) || undefined,
    free: sc.free === true,
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
    name: str(si.name, 'Untitled piece'),
    category: str(si.category, 'details') as ShopItem['category'],
    tone: str(si.tone, staticMatch?.tone ?? 'sage') as ShopItem['tone'],
    glyph: str(si.glyphFallback, staticMatch?.glyph ?? 'package') as any,
    desc: str(si.description, staticMatch?.desc ?? ''),
    free,
    collectionIds: ctx.collectionIds,
    isNew: false,
    flowerAsset: (imageSource(si.assetUrl) ?? staticMatch?.flowerAsset) as any,
  }
}

export interface Catalogue {
  items: ShopItem[]
  collections: Collection[]
  /**
   * True when the backend actually answered. Lets callers tell "the shop is
   * genuinely empty" (show nothing) from "we couldn't reach Sanity" (keep the
   * offline fallback) — otherwise wiping the dataset makes the demo catalogue
   * appear as if it were real, buyable content.
   */
  ok: boolean
}

/**
 * Fetch items + collections together and derive each item's `collectionIds` and
 * `free` flag by inverting the collection→items relation. Fails soft: if either
 * query returns empty, that half falls back to the static catalogue at the
 * call-site (callers only replace state when the array is non-empty).
 */
export async function fetchCatalogue(): Promise<Catalogue> {
  const [rawItems, rawCollections] = await Promise.all([fetchLiveItems(), fetchLiveCollections()])
  // Both halves must have answered for the result to be authoritative.
  const ok = rawItems !== null && rawCollections !== null

  // One unusable document shouldn't empty the shop, so conversion is per-doc.
  const collections = (rawCollections ?? [])
    .filter((sc) => sc && typeof sc._id === 'string')
    .flatMap((sc) => {
      try {
        return [sanityCollectionToCollection(sc)]
      } catch (e) {
        console.warn('Skipping malformed collection', sc?._id, e)
        return []
      }
    })

  // Invert: itemId → [collectionId], plus the set of items in any free collection.
  const itemToCollections: Record<string, string[]> = {}
  const freeFromCollection = new Set<string>()
  for (const col of collections) {
    for (const ref of col.items) {
      ;(itemToCollections[ref.id] ??= []).push(col.id)
      if (col.free) freeFromCollection.add(ref.id)
    }
  }

  const items = (rawItems ?? [])
    .filter((si) => si && typeof si._id === 'string')
    .flatMap((si) => {
      const id = stripItemId(si._id)
      try {
        return [
          sanityItemToShopItem(si, {
            collectionIds: itemToCollections[id] ?? [],
            freeFromCollection: freeFromCollection.has(id),
          }),
        ]
      } catch (e) {
        console.warn('Skipping malformed item', si?._id, e)
        return []
      }
    })

  return { items, collections, ok }
}
