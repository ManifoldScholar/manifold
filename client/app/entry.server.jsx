import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { CacheProvider, Global as GlobalStyles } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createStore from "store/createStore";
import { setStore } from "store/storeInstance";
import {
  createEmotionStyleFixerStream,
  createEmotionStyleExtractorStream,
  createEmotionCache,
  EMOTION_CACHE_KEY
} from "./utils/emotion-stream";
import FatalError from "global/components/FatalError";
import { formatError } from "global/components/FatalError/Boundary";
import styles from "theme/styles/globalStyles";

import "utils/i18n";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  routerContext
) {
  // Create a fresh store for each request
  // Middleware handles user/settings via context, so no bootstrap needed
  const store = createStore();
  setStore(store);

  // Create Emotion cache and server instance for advanced SSR
  const cache = createEmotionCache();
  const {
    extractCriticalToChunks,
    constructStyleTagsFromChunks
  } = createEmotionServer(cache);

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let currentStatusCode = responseStatusCode;

    // Create emotion style extractor/injector stream
    const emotionExtractor = createEmotionStyleExtractorStream({
      cacheKey: EMOTION_CACHE_KEY,
      extractCriticalToChunks,
      constructStyleTagsFromChunks,
      cache
    });

    // Create emotion style fixer stream to remove inline styles from Suspense chunks
    const emotionFixer = createEmotionStyleFixerStream({
      cacheKey: EMOTION_CACHE_KEY,
      debug: true // Always debug to catch issues
    });

    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={cache}>
        <Provider store={store}>
          <ServerRouter context={routerContext} url={request.url} />
        </Provider>
      </CacheProvider>,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          // Pipe through: extract/inject styles -> remove inline styles from Suspense chunks
          const readableStream = createReadableStreamFromReadable(body);
          const transformedStream = readableStream
            .pipeThrough(emotionExtractor)
            .pipeThrough(emotionFixer);

          resolve(
            new Response(transformedStream, {
              headers: responseHeaders,
              status: currentStatusCode
            })
          );

          pipe(body);
        },
        onShellError(error) {
          // Render a styled error page when shell fails to render
          // This happens before React Router's error boundary can catch it
          try {
            const errorCache = createEmotionCache();
            const errorServer = createEmotionServer(errorCache);

            // Format the error
            const formattedError = formatError(error);

            // Render error page with styles
            const errorHtml = renderToString(
              <CacheProvider value={errorCache}>
                <html lang="en">
                  <head>
                    <meta charSet="utf-8" />
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1"
                    />
                  </head>
                  <body>
                    <GlobalStyles styles={styles} />
                    <div id="content">
                      <FatalError fatalError={formattedError} />
                    </div>
                  </body>
                </html>
              </CacheProvider>
            );

            // Extract and inject styles
            const chunks = errorServer.extractCriticalToChunks(errorHtml);
            let styleTags = errorServer.constructStyleTagsFromChunks(chunks);

            // Also get styles from cache.inserted (for GlobalStyles)
            if (
              errorCache.inserted &&
              typeof errorCache.inserted === "object"
            ) {
              const insertedKeys = Object.keys(errorCache.inserted);
              const cacheStyles = insertedKeys
                .map(key => {
                  const inserted = errorCache.inserted[key];
                  return typeof inserted === "string" ? inserted : "";
                })
                .filter(Boolean)
                .join("\n");

              if (cacheStyles) {
                styleTags += `<style data-emotion="${EMOTION_CACHE_KEY}">${cacheStyles}</style>`;
              }
            }

            // Inject styles into head
            const styledErrorHtml = errorHtml.replace(
              "</head>",
              `${styleTags}</head>`
            );

            responseHeaders.set("Content-Type", "text/html");
            resolve(
              new Response(`<!doctype html>${styledErrorHtml}`, {
                headers: responseHeaders,
                status: 500
              })
            );
          } catch (renderError) {
            // If rendering the error page fails, fall back to plain error
            console.error("Failed to render error page:", renderError);
            reject(error);
          }
        },
        onError(error) {
          currentStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}
