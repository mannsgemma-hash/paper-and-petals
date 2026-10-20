// Wraps PostHog with graceful fallback for web/Expo Go
import { loadPrefs } from './storage'

let PostHog: any = null
try { PostHog = require('posthog-react-native').PostHog } catch {}

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? ''
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

let client: any = null
// Off until the saved preference has been read, so someone who opted out never
// sends a single event while it loads.
let enabled = false

function ensureClient() {
  if (client || !PostHog || !KEY) return
  try {
    client = new PostHog(KEY, { host: HOST })
  } catch (e) {
    console.warn('PostHog init failed', e)
  }
}

export async function initAnalytics() {
  const { analytics } = await loadPrefs()
  setAnalyticsEnabled(analytics)
}

/** Settings → "Anonymous usage analytics". Stops events and error reports alike. */
export function setAnalyticsEnabled(on: boolean) {
  enabled = on
  if (on) {
    ensureClient()
    try { Promise.resolve(client?.optIn?.()).catch(() => {}) } catch {}
  } else {
    try { Promise.resolve(client?.optOut?.()).catch(() => {}) } catch {}
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!enabled) return
  try { client?.capture(event, props) } catch {}
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  if (!enabled) return
  try { client?.identify(userId, traits) } catch {}
}

export function screen(name: string, props?: Record<string, unknown>) {
  if (!enabled) return
  try { client?.screen(name, props) } catch {}
}

/**
 * Report a caught/uncaught error so release crashes leave a trail. Sends the
 * message + stack to PostHog when available and allowed, and always logs to the
 * console.
 */
export function captureException(error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error))
  if (enabled) {
    try {
      client?.capture('app_error', {
        message: err.message,
        stack: err.stack,
        ...context,
      })
    } catch {}
  }
  console.error('[captureException]', err, context)
}
