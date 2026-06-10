let OneSignal: any = null
try { OneSignal = require('react-native-onesignal').OneSignal } catch {}

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID ?? ''

export function initNotifications() {
  if (!OneSignal || !APP_ID) return
  try {
    OneSignal.initialize(APP_ID)
    OneSignal.Notifications.requestPermission(true)
  } catch (e) {
    console.warn('OneSignal init failed', e)
  }
}

export function setNotificationUserId(userId: string) {
  try { OneSignal.login(userId) } catch {}
}

export function setNotificationTags(tags: Record<string, string>) {
  try { OneSignal.User.addTags(tags) } catch {}
}
