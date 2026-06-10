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

export async function getIsPremium(): Promise<boolean> {
  if (!Purchases) return false
  try {
    const info = await Purchases.getCustomerInfo()
    return info.entitlements.active['premium'] != null
  } catch {
    return false
  }
}

export async function purchasePackage(packageType: 'monthly' | 'annual'): Promise<boolean> {
  if (!Purchases) return false
  try {
    const offerings = await Purchases.getOfferings()
    const pkg = packageType === 'monthly'
      ? offerings.current?.monthly
      : offerings.current?.annual
    if (!pkg) return false
    const { customerInfo } = await Purchases.purchasePackage(pkg)
    return customerInfo.entitlements.active['premium'] != null
  } catch (e: any) {
    if (e?.userCancelled) return false
    throw e
  }
}

export async function restorePurchases(): Promise<boolean> {
  if (!Purchases) return false
  try {
    const info = await Purchases.restorePurchases()
    return info.entitlements.active['premium'] != null
  } catch {
    return false
  }
}
