import { Platform } from 'react-native'

// react-native-purchases requires a native build; stub gracefully for web/Expo Go
let Purchases: any = null
try { Purchases = require('react-native-purchases').default } catch {}

// RevenueCat *public* SDK keys — designed to be embedded in the client, so it's
// safe to ship these defaults. A .env value (EXPO_PUBLIC_REVENUECAT_*) overrides.
const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || 'appl_cKqXLjtIJBZjnZQTfjuqsJiXSbL'
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || ''

/** RevenueCat entitlement that grants the full living catalogue. */
export const STUDIO_ENTITLEMENT = 'studio'

const COLLECTION_PREFIX = 'com.paperandpetals.collection.'
// Legacy one-time per-item products, kept only so existing buyers are grandfathered.
const LEGACY_PACK_PREFIX = 'com.paperandpetals.pack.'

export type StudioPlan = 'monthly' | 'annual'

export interface Entitlements {
  /** Active Studio subscription. */
  studio: boolean
  /** Ids of one-time collections the account owns. */
  ownedCollectionIds: string[]
  /** Ids of items bought under the old per-item model (grandfathered). */
  legacyOwnedItemIds: string[]
}

export function initRevenueCat() {
  if (!Purchases) return
  const apiKey = Platform.OS === 'ios' ? IOS_KEY : ANDROID_KEY
  if (!apiKey) return
  try {
    Purchases.configure({ apiKey })
  } catch (e) {
    console.warn('RevenueCat init failed', e)
  }
}

/** Map a product identifier back to a collection id. */
function collectionIdFromProduct(productId: string): string | null {
  return productId.startsWith(COLLECTION_PREFIX) ? productId.slice(COLLECTION_PREFIX.length) : null
}

/** Map a legacy product identifier back to the item id. */
function legacyItemIdFromProduct(productId: string): string | null {
  return productId.startsWith(LEGACY_PACK_PREFIX) ? productId.slice(LEGACY_PACK_PREFIX.length) : null
}

function entitlementsFromInfo(info: any): Entitlements {
  const studio = !!info?.entitlements?.active?.[STUDIO_ENTITLEMENT]
  const txns = info?.nonSubscriptionTransactions ?? []
  const ownedCollectionIds = txns
    .map((t: any) => collectionIdFromProduct(t.productIdentifier))
    .filter((id: string | null): id is string => !!id)
  // Grandfather: old per-item purchases stay unlocked under the collection model.
  const legacyOwnedItemIds = txns
    .map((t: any) => legacyItemIdFromProduct(t.productIdentifier))
    .filter((id: string | null): id is string => !!id)
  return {
    studio,
    ownedCollectionIds: Array.from(new Set(ownedCollectionIds)),
    legacyOwnedItemIds: Array.from(new Set(legacyOwnedItemIds)),
  }
}

/**
 * Read the current entitlements from RevenueCat. Safe to call on boot —
 * returns an empty result when the SDK isn't available (web / Expo Go).
 */
export async function syncEntitlements(): Promise<Entitlements> {
  if (!Purchases) return { studio: false, ownedCollectionIds: [], legacyOwnedItemIds: [] }
  try {
    const info = await Purchases.getCustomerInfo()
    return entitlementsFromInfo(info)
  } catch {
    return { studio: false, ownedCollectionIds: [], legacyOwnedItemIds: [] }
  }
}

/**
 * Subscribe to Studio. Reads the current offering and buys the package matching
 * the chosen plan. Configure these in RevenueCat:
 *   - Offering "studio" with packages: Monthly + Annual
 *   - Both granting the "studio" entitlement
 * Returns true if the studio entitlement is active afterwards.
 */
export async function purchaseStudio(plan: StudioPlan): Promise<boolean> {
  if (!Purchases) throw new Error('Store not available on this platform')
  const offerings = await Purchases.getOfferings()
  const current = offerings?.current
  if (!current) throw new Error('Subscriptions aren’t available just yet. Please try again soon.')
  const pkg = plan === 'annual' ? current.annual : current.monthly
  if (!pkg) throw new Error('That plan isn’t available right now. Please try the other option.')
  const { customerInfo } = await Purchases.purchasePackage(pkg)
  return !!customerInfo?.entitlements?.active?.[STUDIO_ENTITLEMENT]
}

/**
 * Buy a single collection — owned forever.
 * Product identifiers must be created in App Store Connect / Google Play as:
 *   com.paperandpetals.collection.<collectionId>
 */
export async function purchaseCollection(collectionId: string): Promise<boolean> {
  if (!Purchases) throw new Error('Store not available on this platform')
  const productId = `${COLLECTION_PREFIX}${collectionId}`
  const products = await Purchases.getProducts([productId])
  if (!products || products.length === 0) {
    throw new Error('This collection isn’t available to buy yet. You can unlock it with Studio.')
  }
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0])
  return !!customerInfo.nonSubscriptionTransactions?.find(
    (t: any) => t.productIdentifier === productId
  )
}

/**
 * Restore previously bought collections and any active subscription.
 * Returns the full entitlement picture so the store can sync.
 */
export async function restorePurchases(): Promise<Entitlements> {
  if (!Purchases) return { studio: false, ownedCollectionIds: [], legacyOwnedItemIds: [] }
  try {
    const info = await Purchases.restorePurchases()
    return entitlementsFromInfo(info)
  } catch {
    return { studio: false, ownedCollectionIds: [], legacyOwnedItemIds: [] }
  }
}
