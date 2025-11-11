/**
 * Store instance module for accessing Redux store in React Router v6 loaders.
 *
 * This module provides a fallback way for loaders to access the store when
 * context.store is not available. Loaders should prefer context.store (for SSR)
 * and fall back to getStore() if needed.
 *
 * Usage:
 * - SSR: setStore() is called in entry-ssr.js before creating the static handler.
 *   The store is also passed via context to createStaticHandler, but setStore()
 *   provides a fallback in case context doesn't work as expected.
 * - Client-side: The store instance persists from SSR, so no additional setup
 *   is needed. Loaders use getStore() as a fallback when context.store is unavailable.
 */

let storeInstance = null;

/**
 * Set the store instance (called from entry-ssr.js for SSR)
 * @param {Object} store - Redux store instance
 */
export function setStore(store) {
  storeInstance = store;
}

/**
 * Get the store instance (called from loaders as a fallback)
 *
 * @returns {Object} Redux store instance
 * @throws {Error} If store has not been initialized
 */
export function getStore() {
  if (!storeInstance) {
    throw new Error(
      "Store not initialized. Make sure setStore() is called before loaders run."
    );
  }
  return storeInstance;
}
