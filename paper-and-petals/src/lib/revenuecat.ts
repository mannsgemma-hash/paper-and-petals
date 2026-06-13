import { Platform } from 'react-native'

// react-native-purchases requires a native build; stub gracefully for web/Expo Go
let Purchases: any = null
try { Purchases = require('react-native-purchases').default } catch {}

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? ''
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? ''

/** RevenueCat entitlement that grants the full living catalogue. */
export const STUDIO_ENTITLEMENT = 'studio'

export type StudioPlan = 'monthly' | 'annual'

export interface Entitlements {
  /** Active Studio subscription. */
  studio: boolean
  /** Ids of one-time "keepsake" packs the account owns. */
  ownedPackIds: string[]
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

/** Map a product identifier (com.paperandpetals.pack.<id>) back to the item id. */
function packIdFromProduct(productId: string): string | null {
  const prefix = 'com.paperandpetals.pack.'
  return productId.startsWith(prefix) ? productId.slice(prefix.length) : null
}

function entitlementsFromInfo(info: any): Entitlements {
  const studio = !!info?.entitlements?.active?.[STUDIO_ENTITLEMENT]
  const ownedPackIds = (info?.nonSubscriptionTransactions ?? [])
    .map((t: any) => packIdFromProduct(t.productIdentifier))
    .filter((id: string | null): id is string => !!id)
  return { studio, ownedPackIds: Array.from(new Set(ownedPackIds)) }
}

/**
 * Read the current entitlements from RevenueCat. Safe to call on boot —
 * returns an empty result when the SDK isn't available (web / Expo Go).
 */
export async function syncEntitlements(): Promise<Entitlements> {
  if (!Purchases) return { studio: false, ownedPackIds: [] }
  try {
    const info = await Purchases.getCustomerInfo()
    return entitlementsFromInfo(info)
  } catch {
    return { studio: false, ownedPackIds: [] }
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
 * Buy a single keepsake pack — owned forever.
 * Product identifiers must be created in App Store Connect / Google Play as:
 *   com.paperandpetals.pack.<itemId>
 */
export async function purchaseSingleItem(itemId: string): Promise<boolean> {
  if (!Purchases) throw new Error('Store not available on this platform')
  const productId = `com.paperandpetals.pack.${itemId}`
  const products = await Purchases.getProducts([productId])
  if (!products || products.length === 0) {
    throw new Error('This pack isn’t available for individual purchase yet. You can unlock it with Studio.')
  }
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0])
  return !!customerInfo.nonSubscriptionTransactions?.find(
    (t: any) => t.productIdentifier === productId
  )
}

/**
 * Restore previously bought packs and any active subscription.
 * Returns the full entitlement picture so the store can sync.
 */
export async function restorePurchases(): Promise<Entitlements> {
  if (!Purchases) return { studio: false, ownedPackIds: [] }
  try {
    const info = await Purchases.restorePurchases()
    return entitlementsFromInfo(info)
  } catch {
    return { studio: false, ownedPackIds: [] }
  }
}
