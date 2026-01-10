/**
 * Utility for fixing Emotion SSR streaming hydration issues with React 18+ Suspense.
 *
 * Problem: Emotion renders inline style tags in Suspense boundaries. When React hydrates,
 * client-side Emotion modifies these tags' data-emotion attributes, causing hydration mismatches.
 *
 * Solution:
 * 1. Extract inline style tags from the initial shell HTML
 * 2. Inject consolidated styles into <head>
 * 3. Remove inline style tags from Suspense chunks during streaming
 *
 * Styles remain available via <head> or Emotion's client cache.
 */

import createCache from "@emotion/cache";

/**
 * Emotion cache key - using default "css" to match Emotion's default behavior
 * and ensure consistency between server and client.
 */
export const EMOTION_CACHE_KEY = "css";

/**
 * Creates an Emotion cache configured for advanced SSR.
 * Sets compat mode to suppress "unsafe selector" warnings since the advanced
 * SSR approach handles :first-child, :nth-child, etc. correctly by placing
 * styles in <head> rather than inline.
 *
 * Note: @emotion/server automatically sets compat=true on the server,
 * but we need to set it on the client as well to suppress warnings there.
 *
 * @returns Emotion cache instance
 */
export const createEmotionCache = () => {
  const cache = createCache({ key: EMOTION_CACHE_KEY });
  // Enable compat mode to suppress "unsafe selector" warnings
  // (:first-child, :nth-child, etc.) - these are safe with advanced SSR
  // since styles are extracted and placed in <head>, not inline
  cache.compat = true;
  return cache;
};

/**
 * Creates a TransformStream that extracts Emotion styles from the initial shell HTML
 * and injects them into the <head> section.
 *
 * @param options - Configuration options
 * @returns TransformStream for use with .pipeThrough()
 */
export function createEmotionStyleExtractorStream(options = {}) {
  const {
    cacheKey = EMOTION_CACHE_KEY,
    extractCriticalToChunks,
    constructStyleTagsFromChunks
  } = options;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let stylesInjected = false;
  let shellBuffer = "";

  return new TransformStream({
    transform(chunk, controller) {
      try {
        const html = decoder.decode(chunk, { stream: true });

        // If styles haven't been injected yet, we're still processing the shell
        if (!stylesInjected) {
          shellBuffer += html;

          // Check if we have the complete head section
          if (shellBuffer.includes("</head>")) {
            // Extract critical CSS from the shell HTML
            const chunks = extractCriticalToChunks(shellBuffer);
            const styleTags = constructStyleTagsFromChunks(chunks);

            // Inject styles into </head>
            const modifiedHtml = shellBuffer.replace(
              "</head>",
              `${styleTags}</head>`
            );

            stylesInjected = true;
            shellBuffer = "";
            controller.enqueue(encoder.encode(modifiedHtml));
          }
          // If we don't have </head> yet, keep buffering
          return;
        }

        // After styles are injected, pass through chunks unchanged
        controller.enqueue(encoder.encode(html));
      } catch (error) {
        console.error("[EmotionStyleExtractor] Error processing chunk:", error);
        controller.enqueue(chunk);
      }
    },
    flush(controller) {
      // If we still have buffered content (shouldn't happen normally), flush it
      if (shellBuffer) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(shellBuffer));
      }
    }
  });
}

/**
 * Creates a TransformStream that removes inline Emotion style tags from Suspense chunks.
 *
 * @param options - Configuration options
 * @returns TransformStream for use with .pipeThrough()
 */
export function createEmotionStyleFixerStream(options = {}) {
  const {
    cacheKey = EMOTION_CACHE_KEY,
    suspenseBoundaryMarker = '<div hidden id="S:',
    debug = false
  } = options;

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const inlineStyleRegex = new RegExp(
    `<style data-emotion="${cacheKey}[^"]*">.*?</style>`,
    "g"
  );

  return new TransformStream({
    transform(chunk, controller) {
      try {
        let html = decoder.decode(chunk, { stream: true });

        // Only process Suspense boundary chunks
        if (html.includes(suspenseBoundaryMarker)) {
          const before = html;
          html = html.replace(inlineStyleRegex, "");
          if (debug && before !== html) {
            console.log(
              "[EmotionStyleFixer] Removed inline styles from Suspense chunk"
            );
          }
        }

        controller.enqueue(encoder.encode(html));
      } catch (error) {
        console.error("[EmotionStyleFixer] Error processing chunk:", error);
        controller.enqueue(chunk);
      }
    }
  });
}
