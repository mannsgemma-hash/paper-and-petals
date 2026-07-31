// Wraps PostHog with graceful fallback for web/Expo Go
let PostHog: any = null
try { PostHog = require('posthog-react-native').PostHog } catch {}

const KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? ''
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

let client: any = null

export function initAnalytics() {
  if (!PostHog || !KEY) return
  try {
    client = new PostHog(KEY, { host: HOST })
  } catch (e) {
    console.warn('PostHog init failed', e)
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  try { client?.capture(event, props) } catch {}
}

export function identify(userId: string, traits?: Record<string, unknown>) {
  try { client?.identify(userId, traits) } catch {}
}

export function screen(name: string, props?: Record<string, unknown>) {
  try { client?.screen(name, props) } catch {}
}

/**
 * Report a caught/uncaught error so release crashes leave a trail. Sends the
 * message + stack to PostHog when available and always logs to the console.
 */
export function captureException(error: unknown, context?: Record<string, unknown>) {
  const err = error instanceof Error ? error : new Error(String(error))
  try {
    client?.capture('app_error', {
      message: err.message,
      stack: err.stack,
      ...context,
    })
  } catch {}
  console.error('[captureException]', err, context)
}
