import { sanity } from '../lib/sanity'
import { SHOP_CATALOGUE, ShopItem } from '../data/shop'

// ─── Live shop catalogue ────────────────────────────────────────────────────────
// New items simply appear here as they are published in Sanity — there is no
// daily pack; the store is the single source of new content.

const LIVE_ITEMS_QUERY = `*[_type == "item" && (!defined(publishAt) || publishAt <= now())] | order(category asc, name asc) {
  _id,
  name,
  category,
  tier,
  price,
  publishAt,
  description,
  glyphFallback,
  tone,
  itemCount,
  "assetUrl": asset.asset->url
}`

export interface SanityItem {
  _id: string
  name: string
  category: string
  tier: 'free' | 'paid'
  price: number
  description: string
  glyphFallback: string
  tone: string
  itemCount: number
  assetUrl?: string
}

export async function fetchLiveItems(): Promise<SanityItem[]> {
  try {
    return await sanity.fetch(LIVE_ITEMS_QUERY)
  } catch {
    return []
  }
}

export function sanityItemToShopItem(si: SanityItem): ShopItem {
  const staticMatch = SHOP_CATALOGUE.find(s => `item-${s.id}` === si._id)
  return {
    id: si._id.replace('item-', ''),
    name: si.name,
    category: si.category as ShopItem['category'],
    price: si.price ?? 0,
    tone: (si.tone ?? staticMatch?.tone ?? 'sage') as ShopItem['tone'],
    glyph: (si.glyphFallback ?? staticMatch?.glyph ?? 'package') as any,
    desc: si.description ?? staticMatch?.desc ?? '',
    items: si.itemCount ?? staticMatch?.items ?? 0,
    owned: false,
    isNew: false,
    flowerAsset: si.assetUrl ? { uri: si.assetUrl } as any : staticMatch?.flowerAsset,
  }
}
