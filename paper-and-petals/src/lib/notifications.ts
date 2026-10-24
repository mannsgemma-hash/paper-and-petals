import { router } from 'expo-router'
import { loadPrefs, type Prefs } from './storage'
import { JOURNAL_PROMPTS } from '../data/prompts'

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
  home: '/(tabs)',
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
 * with --audience seasonal), and the "away a while" Journey targets
 * `notify_reminders = 1`.
 *
 * `journal_prompt` is a fresh prompt each launch, for that Journey's message
 * to quote ({{ journal_prompt }}), so the nudge carries an idea, not a guilt
 * trip.
 */
export function applyNotificationPrefs(prefs: Prefs) {
  setNotificationTags({
    notify_new_items: prefs.notifyNewItems ? '1' : '0',
    notify_collections: prefs.notifyCollections ? '1' : '0',
    notify_reminders: prefs.notifyReminders ? '1' : '0',
    journal_prompt: JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)],
  })
}

/**
 * Studio free-trial reminder. While a trial is set to renew, tag the moment
 * the reminder is due (two days before it ends, unix seconds); a OneSignal
 * Journey sends it then. Cancelling the trial, or it converting, clears the
 * tag, so nobody is reminded about a trial they've already dealt with —
 * provided the app has been opened since.
 */
const TRIAL_REMINDER_LEAD_S = 2 * 24 * 60 * 60

export function applyTrialReminder(trialEndsAtMs: number | null) {
  try {
    if (trialEndsAtMs) {
      OneSignal.User.addTag(
        'trial_reminder_at',
        String(Math.floor(trialEndsAtMs / 1000) - TRIAL_REMINDER_LEAD_S),
      )
    } else {
      OneSignal.User.removeTag('trial_reminder_at')
    }
  } catch {}
}

export function setNotificationUserId(userId: string) {
  try { OneSignal.login(userId) } catch {}
}

export function setNotificationTags(tags: Record<string, string>) {
  try { OneSignal.User.addTags(tags) } catch {}
}
