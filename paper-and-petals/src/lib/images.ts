// Image sizing for grids.
//
// Sanity serves the asset at whatever size it was uploaded — the pipeline caps
// display art at 1600px (PP_MAX_DIM). A 1600×1600 PNG costs ~10MB of RAM once
// decoded, so a screen that mounts a few hundred of them at full size runs the
// device out of memory and the OS kills the app. That's a native crash: no JS
// error, so nothing an ErrorBoundary can catch.
//
// Sanity's CDN resizes on request, so asking for the size actually being drawn
// turns each of those 10MB decodes into well under 1MB.

/** Widest side a grid thumbnail is ever drawn at, in device px (2x for retina). */
export const THUMB_PX = 400;
/** A detail/preview image — bigger, but still nowhere near the full asset. */
export const PREVIEW_PX = 900;

const SANITY_CDN = /\/\/cdn\.sanity\.io\//;

/**
 * Ask Sanity for a resized copy of a remote image source.
 *
 * `fit=max` never enlarges and keeps the aspect ratio, and the format is left
 * alone deliberately: `auto=format` would hand back WebP, which React Native's
 * iOS Image doesn't decode, and the art is transparent PNG that must stay PNG.
 *
 * Anything that isn't a Sanity URL — a bundled `require()`, a local file, a
 * user upload — is returned untouched.
 */
export function thumbSource<T>(source: T, px: number = THUMB_PX): T {
  if (!source || typeof source !== 'object') return source;
  const uri = (source as { uri?: unknown }).uri;
  if (typeof uri !== 'string' || !SANITY_CDN.test(uri)) return source;
  if (/[?&]w=/.test(uri)) return source; // already sized
  const sep = uri.includes('?') ? '&' : '?';
  return { ...(source as object), uri: `${uri}${sep}w=${px}&h=${px}&fit=max` } as T;
}
