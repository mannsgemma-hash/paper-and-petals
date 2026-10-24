import { router } from 'expo-router'
import { loadPrefs, type Prefs } from './storage'

let OneSignal: any = null
try { OneSignal = require('react-native-onesignal').OneSignal } catch {}

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? ''

/**
 * Where a tapped notification may take someone. A notification carries only a
 * key (`data.route`), never a path, so nothing sent from outside the app can
 * open a screen that isn't listed here.
 */
const ROUTES: Record<string, string> = {
  shop: '/(tabs)/shop',
}

export function initNotifications() {
  if (!OneSignal || !APP_ID) return
  try {
    // No permission ask here: a prompt before someone has made anything is
    // mostly declined. engagement.ts asks once they've left a first journal.
    OneSignal.initialize(APP_ID)
    OneSignal.Notifications.addEventListener('click', (event: any) => {
      const path = ROUTES[String(event?.notification?.additionalData?.route ?? '')]
      if (!path) return
      // On a cold start the tap arrives while the first screen is still
      // routing; let that settle before moving on.
      setTimeout(() => {
        try { router.push(path as any) } catch {}
      }, 600)
    })
  } catch (e) {
    console.warn('OneSignal init failed', e)
  }
  // Re-send the saved choices on every launch, so the tags exist even for
  // someone who never opens Settings.
  loadPrefs().then(applyNotificationPrefs).catch(() => {})
}

/**
 * Show the iOS permission dialog. iOS shows it once; after a refusal,
 * `fallbackToSettings` offers to open the app's page in iOS Settings instead —
 * right when someone flips a switch in Settings, wrong as an unprompted ask.
 */
export function requestNotificationPermission(fallbackToSettings = false) {
  if (!OneSignal || !APP_ID) return
  try {
    Promise.resolve(OneSignal.Notifications.requestPermission(fallbackToSettings)).catch(() => {})
  } catch {}
}

/**
 * Settings → Notifications. The switches become OneSignal tags; the studio's
 * `npm run notify` targets `notify_new_items = 1` (or `notify_collections = 1`
 * with --audience seasonal).
 */
export function applyNotificationPrefs(prefs: Prefs) {
  setNotificationTags({
    notify_new_items: prefs.notifyNewItems ? '1' : '0',
    notify_collections: prefs.notifyCollections ? '1' : '0',
  })
}

export function setNotificationUserId(userId: string) {
  try { OneSignal.login(userId) } catch {}
}

export function setNotificationTags(tags: Record<string, string>) {
  try { OneSignal.User.addTags(tags) } catch {}
}
