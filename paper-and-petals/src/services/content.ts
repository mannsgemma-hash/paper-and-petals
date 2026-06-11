import { sanity } from '../lib/sanity'
import { SHOP_CATALOGUE, ShopItem } from '../data/shop'

// ─── Daily pack ───────────────────────────────────────────────────────────────

const PACK_ITEM_FRAGMENT = `{
  _id,
  name,
  category,
  tone,
  glyphFallback,
  "assetUrl": asset.asset->url
}`

export interface DailyPack {
  freeItems: SanityItem[]
  subItems: SanityItem[]
}

export async function fetchTodaysPack(): Promise<DailyPack> {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  try {
    const pack = await sanity.fetch(
      `*[_type == "pack" && date == $today][0]{
        "freeItems": freeParcel[]-> ${PACK_ITEM_FRAGMENT},
        "subItems":  subParcel[]-> ${PACK_ITEM_FRAGMENT}
      }`,
      { today },
    )
    return {
      freeItems: pack?.freeItems ?? [],
      subItems: pack?.subItems ?? [],
    }
  } catch {
    return { freeItems: [], subItems: [] }
  }
}

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
