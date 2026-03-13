import type { SkinDefinition } from '../schema.js';
import { isValidSkin } from '../schema.js';

/**
 * Options for loading a skin from a URL
 */
export interface LoadSkinOptions {
  /** Skin URL (can be jsDelivr CDN or any URL) */
  url: string;

  /** Optional timeout in milliseconds */
  timeout?: number;

  /** Cache the skin in memory */
  cache?: boolean;

  /** Enable debug logging */
  debug?: boolean;
}

// Simple in-memory cache for loaded skins
const skinCache = new Map<string, SkinDefinition>();

/**
 * Loads a skin from a URL (typically jsDelivr CDN)
 * Supports caching to avoid redundant network requests
 */
export async function loadSkin(
  options: LoadSkinOptions
): Promise<SkinDefinition> {
  const { url, timeout = 10000, cache = true, debug = false } = options;

  // Check cache first
  if (cache && skinCache.has(url)) {
    if (debug) {
      console.log('[loadSkin] Cache hit:', url);
    }
    return skinCache.get(url)!;
  }

  if (debug) {
    console.log('[loadSkin] Fetching from URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const skinData = await response.json();

    if (!isValidSkin(skinData)) {
      throw new Error('Invalid skin format');
    }

    // Cache the result
    if (cache) {
      skinCache.set(url, skinData);
    }

    if (debug) {
      console.log('[loadSkin] Loaded skin:', skinData.id, skinData.version);
    }

    return skinData;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load skin from ${url}: ${errorMessage}`);
  }
}

/**
 * Loads a skin from jsDelivr CDN
 * Convenience wrapper for common CDN usage
 */
export async function loadSkinFromJsDelivr(
  packageVersion: string,
  skinPath: string,
  options?: Omit<LoadSkinOptions, 'url'>
): Promise<SkinDefinition> {
  const url = `https://cdn.jsdelivr.net/npm/@page-speed/skins@${packageVersion}/${skinPath}`;
  return loadSkin({ ...options, url });
}

/**
 * Preloads multiple skins in parallel
 * Useful for warming the cache
 */
export async function preloadSkins(
  urls: string[],
  options?: Omit<LoadSkinOptions, 'url'>
): Promise<SkinDefinition[]> {
  return Promise.all(
    urls.map((url) => loadSkin({ ...options, url }))
  );
}

/**
 * Clears the skin cache
 */
export function clearSkinCache(): void {
  skinCache.clear();
}

/**
 * Gets cache statistics
 */
export function getSkinCacheStats(): {
  size: number;
  urls: string[];
} {
  return {
    size: skinCache.size,
    urls: Array.from(skinCache.keys()),
  };
}
