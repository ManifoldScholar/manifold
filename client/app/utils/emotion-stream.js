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
    constructStyleTagsFromChunks,
    cache
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
            // This extracts styles that appear in the HTML (with data-emotion attributes)
            const chunks = extractCriticalToChunks(shellBuffer);
            let styleTags = constructStyleTagsFromChunks(chunks);
            
            // Debug logging
            if (process.env.NODE_ENV === 'development') {
              console.log("[EmotionStyleExtractor] Extracting styles...");
              console.log("[EmotionStyleExtractor] Chunks count:", chunks.styles?.length || 0);
              console.log("[EmotionStyleExtractor] Style tags length:", styleTags.length);
              console.log("[EmotionStyleExtractor] Cache exists:", !!cache);
              console.log("[EmotionStyleExtractor] Cache.sheet exists:", !!(cache && cache.sheet));
            }
            
            // Also extract ALL styles directly from the cache's sheet
            // This includes GlobalStyles and any other styles added to the cache
            // that might not appear in the HTML
            if (cache && cache.sheet) {
              try {
                const sheet = cache.sheet;
                
                if (process.env.NODE_ENV === 'development') {
                  console.log("[EmotionStyleExtractor] Sheet keys:", Object.keys(sheet));
                  console.log("[EmotionStyleExtractor] Sheet.css:", typeof sheet.css, !!sheet.css);
                  console.log("[EmotionStyleExtractor] Sheet.tags:", Array.isArray(sheet.tags), sheet.tags?.length);
                }
                
                // Try different ways to access the styles from the cache
                let cacheStyles = "";
                
                // Method 1: sheet.css (if available)
                if (sheet.css) {
                  cacheStyles = sheet.css;
                  if (process.env.NODE_ENV === 'development') {
                    console.log("[EmotionStyleExtractor] Found styles in sheet.css, length:", cacheStyles.length);
                  }
                }
                // Method 2: cache.inserted (object containing all inserted styles)
                // This is where GlobalStyles adds its styles, so we need to get them from here
                if (cache.inserted && typeof cache.inserted === 'object') {
                  const insertedKeys = Object.keys(cache.inserted);
                  if (insertedKeys.length > 0) {
                    if (process.env.NODE_ENV === 'development') {
                      console.log("[EmotionStyleExtractor] Found inserted styles, keys:", insertedKeys.length);
                    }
                    // Get all CSS from inserted styles
                    // cache.inserted is a Map-like object where values are the CSS strings
                    cacheStyles = insertedKeys
                      .map(key => {
                        const inserted = cache.inserted[key];
                        // inserted is the CSS string directly
                        if (typeof inserted === 'string') {
                          return inserted;
                        }
                        return '';
                      })
                      .filter(Boolean)
                      .join('\n');
                    if (cacheStyles && process.env.NODE_ENV === 'development') {
                      console.log("[EmotionStyleExtractor] Extracted CSS from cache.inserted, length:", cacheStyles.length);
                    }
                  }
                }
                // Method 3: sheet.tags (array of style elements) - fallback
                if (!cacheStyles && sheet.tags && Array.isArray(sheet.tags) && sheet.tags.length > 0) {
                  cacheStyles = sheet.tags
                    .map(tag => {
                      // Try to get the text content or innerHTML
                      if (typeof tag.textContent === 'string') {
                        return tag.textContent;
                      }
                      if (typeof tag.innerHTML === 'string') {
                        return tag.innerHTML;
                      }
                      // Try accessing the style element's content directly
                      if (tag.styleSheet && tag.styleSheet.cssText) {
                        return tag.styleSheet.cssText;
                      }
                      return '';
                    })
                    .filter(Boolean)
                    .join('\n');
                  if (process.env.NODE_ENV === 'development') {
                    console.log("[EmotionStyleExtractor] Found styles in sheet.tags, length:", cacheStyles.length);
                  }
                }
                // Method 3: sheet.flush (if it's a function that returns styles)
                else if (typeof sheet.flush === 'function') {
                  const flushed = sheet.flush();
                  if (flushed && typeof flushed === 'string') {
                    cacheStyles = flushed;
                    if (process.env.NODE_ENV === 'development') {
                      console.log("[EmotionStyleExtractor] Found styles via sheet.flush, length:", cacheStyles.length);
                    }
                  }
                }
                
                // If we found cache styles from cache.inserted, always add them
                // These are GlobalStyles that might not be in the HTML, so we need to include them
                if (cacheStyles) {
                  // Always add cache.inserted styles since they're GlobalStyles
                  // that might not appear in the extracted HTML
                  const cacheStyleTag = `<style data-emotion="${cacheKey}">${cacheStyles}</style>`;
                  styleTags += cacheStyleTag;
                  if (process.env.NODE_ENV === 'development') {
                    console.log("[EmotionStyleExtractor] Added cache.inserted styles to styleTags, length:", cacheStyles.length);
                  }
                } else if (process.env.NODE_ENV === 'development') {
                  console.log("[EmotionStyleExtractor] No cache styles found");
                }
              } catch (error) {
                // If accessing sheet fails, fall back to just the extracted styles
                console.warn("[EmotionStyleExtractor] Failed to access cache sheet:", error);
                // Debug: log what's available on the cache
                if (process.env.NODE_ENV === 'development') {
                  console.log("[EmotionStyleExtractor] Cache structure:", {
                    hasSheet: !!cache.sheet,
                    sheetKeys: cache.sheet ? Object.keys(cache.sheet) : [],
                    cacheKeys: Object.keys(cache)
                  });
                }
              }
            } else if (process.env.NODE_ENV === 'development') {
              console.log("[EmotionStyleExtractor] No cache or cache.sheet available");
            }

            // Inject styles into </head>
            const modifiedHtml = shellBuffer.replace(
              "</head>",
              `${styleTags}</head>`
            );

            if (process.env.NODE_ENV === 'development') {
              console.log("[EmotionStyleExtractor] Injecting styles into head");
              console.log("[EmotionStyleExtractor] Style tags length:", styleTags.length);
              console.log("[EmotionStyleExtractor] Modified HTML length:", modifiedHtml.length);
              console.log("[EmotionStyleExtractor] Head section includes styles:", modifiedHtml.includes('<style data-emotion'));
              
              // Extract a sample of the head section to verify styles are there
              const headMatch = modifiedHtml.match(/<head>[\s\S]*?<\/head>/);
              if (headMatch) {
                const headContent = headMatch[0];
                const styleTagCount = (headContent.match(/<style[^>]*data-emotion/g) || []).length;
                console.log("[EmotionStyleExtractor] Head section style tag count:", styleTagCount);
                console.log("[EmotionStyleExtractor] First 500 chars of head:", headContent.substring(0, 500));
              }
            }

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

        // Debug: check if we're accidentally removing styles from head
        if (debug && html.includes("</head>")) {
          const hasStylesInHead = /<style[^>]*data-emotion[^>]*>/.test(html);
          if (!hasStylesInHead && html.includes("<head>")) {
            console.warn("[EmotionStyleFixer] WARNING: Head section has no style tags!");
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
