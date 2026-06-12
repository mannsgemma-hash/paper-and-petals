import { Platform } from 'react-native'

// react-native-purchases requires a native build; stub gracefully for web/Expo Go
let Purchases: any = null
try { Purchases = require('react-native-purchases').default } catch {}

const IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ?? ''
const ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY ?? ''

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

/**
 * Purchase a single item from the store.
 * Product identifiers must be created in App Store Connect / Google Play
 * using the convention: com.paperandpetals.item.<itemId>
 */
export async function purchaseSingleItem(itemId: string): Promise<boolean> {
  if (!Purchases) throw new Error('Store not available on this platform')
  const productId = `com.paperandpetals.item.${itemId}`
  const products = await Purchases.getProducts([productId])
  if (!products || products.length === 0) {
    throw new Error('This item is not yet available for individual purchase. Please subscribe to unlock all items.')
  }
  const { customerInfo } = await Purchases.purchaseStoreProduct(products[0])
  return !!customerInfo.nonSubscriptionTransactions?.find(
    (t: any) => t.productIdentifier === productId
  )
}

/**
 * Restore previously bought items. Returns true if the account has any past
 * non-subscription purchases to restore.
 */
export async function restorePurchases(): Promise<boolean> {
  if (!Purchases) return false
  try {
    const info = await Purchases.restorePurchases()
    return (info.nonSubscriptionTransactions?.length ?? 0) > 0
  } catch {
    return false
  }
}
