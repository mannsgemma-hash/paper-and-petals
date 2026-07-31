import { captureException } from './analytics'

let installed = false

/**
 * Route uncaught JS errors through our reporter before the runtime's default
 * handler runs. In a release build the default handler hard-crashes on a fatal
 * error, so this is our one chance to record the message + stack (to PostHog)
 * and learn what actually failed. We preserve the default behaviour afterwards
 * rather than swallowing errors — the ErrorBoundary is what keeps render errors
 * recoverable.
 */
export function installGlobalErrorHandler() {
  if (installed) return
  installed = true

  const globalAny = globalThis as any
  const errorUtils = globalAny.ErrorUtils
  if (errorUtils?.getGlobalHandler && errorUtils?.setGlobalHandler) {
    const previous = errorUtils.getGlobalHandler()
    errorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
      captureException(error, { isFatal: !!isFatal, source: 'globalHandler' })
      if (typeof previous === 'function') previous(error, isFatal)
    })
  }
}
