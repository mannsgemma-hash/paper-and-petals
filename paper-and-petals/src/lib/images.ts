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

import { resolveUploadSource } from './uploadFiles';

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
  // A user's own upload first: its stored path may be from a previous install.
  source = resolveUploadSource(source);
  const uri = (source as { uri?: unknown }).uri;
  if (typeof uri !== 'string' || !SANITY_CDN.test(uri)) return source;
  if (/[?&]w=/.test(uri)) return source; // already sized
  const sep = uri.includes('?') ? '&' : '?';
  return { ...(source as object), uri: `${uri}${sep}w=${px}&h=${px}&fit=max` } as T;
}

/** Drawer tiles are 78×92pt — 240px covers them on any retina iPad. */
export const DRAWER_THUMB_PX = 240;

/**
 * thumbSource for an expo-image <Image>: small and in WebP. expo-image decodes
 * WebP (with transparency), which is typically far smaller than the same PNG
 * at the same size, and with cachePolicy="memory-disk" each tile downloads
 * once rather than on every drawer open.
 * Only for expo-image — React Native's own <Image> on iOS can't show WebP.
 */
export function drawerThumbSource<T>(source: T, px: number = DRAWER_THUMB_PX): T {
  const sized = thumbSource(source, px);
  const uri = (sized as { uri?: unknown } | null)?.uri;
  if (typeof uri !== 'string' || !SANITY_CDN.test(uri) || /[?&]fm=/.test(uri)) return sized;
  return { ...(sized as object), uri: `${uri}&fm=webp&q=80` } as T;
}

/**
 * Sizes the canvas asks Sanity for. A piece is fetched at the first step at or
 * above the pixels it covers on screen, so a sticker stays small while a
 * full-page paper gets the full 2400px asset — sharp, without decoding every
 * piece on a busy page at full size (which runs the iPad out of memory).
 * Steps rather than exact sizes, so resizing a piece rarely refetches it.
 */
const CANVAS_STEPS = [256, 384, 512, 768, 1024, 1536, 2048, 2400];

/** thumbSource for art placed on the journal canvas, at its on-screen pixel size. */
export function canvasSource<T>(source: T, displayPx: number): T {
  const step = CANVAS_STEPS.find((s) => s >= displayPx) ?? CANVAS_STEPS[CANVAS_STEPS.length - 1];
  return thumbSource(source, step);
}
