import { loadPrefs, type Prefs } from './storage'

let OneSignal: any = null
try { OneSignal = require('react-native-onesignal').OneSignal } catch {}

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? ''

export function initNotifications() {
  if (!OneSignal || !APP_ID) return
  try {
    // No permission ask here: a prompt before someone has made anything is
    // mostly declined. engagement.ts asks once they've left a first journal.
    OneSignal.initialize(APP_ID)
  } catch (e) {
    console.warn('OneSignal init failed', e)
  }
  // Re-send the saved choices on every launch, so the tags exist even for
  // someone who never opens Settings.
  loadPrefs().then(applyNotificationPrefs).catch(() => {})
}

/** Show the iOS permission dialog. iOS shows it once; later calls do nothing. */
export function requestNotificationPermission() {
  if (!OneSignal || !APP_ID) return
  try {
    Promise.resolve(OneSignal.Notifications.requestPermission(false)).catch(() => {})
  } catch {}
}

/**
 * Settings → Notifications. The switches become OneSignal tags; target a send
 * with a filter such as `notify_new_items is 1`.
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
