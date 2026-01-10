import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { Provider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createStore from "store/createStore";
import { setStore } from "store/storeInstance";
import {
  createEmotionStyleFixerStream,
  createEmotionStyleExtractorStream,
  createEmotionCache,
  EMOTION_CACHE_KEY
} from "./utils/emotion-stream";

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
      constructStyleTagsFromChunks
    });

    // Create emotion style fixer stream to remove inline styles from Suspense chunks
    const emotionFixer = createEmotionStyleFixerStream({
      cacheKey: EMOTION_CACHE_KEY,
      debug: process.env.NODE_ENV === "development"
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
          reject(error);
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
