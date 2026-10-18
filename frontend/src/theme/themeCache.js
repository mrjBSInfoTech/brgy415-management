import { isValidColorScheme, normalizeColorScheme } from "./customTheme.js";

export const COLOR_SCHEME_CACHE_KEY = "barangay_color_scheme";

export function readCachedColorScheme(storage) {
  try {
    const value = (storage ?? globalThis.localStorage)?.getItem(COLOR_SCHEME_CACHE_KEY);
    return isValidColorScheme(value) ? value.trim() : null;
  } catch {
    return null;
  }
}

export function cacheColorScheme(value, storage) {
  try {
    (storage ?? globalThis.localStorage)?.setItem(COLOR_SCHEME_CACHE_KEY, normalizeColorScheme(value));
  } catch {
    // The database theme still works when browser storage is unavailable.
  }
}
