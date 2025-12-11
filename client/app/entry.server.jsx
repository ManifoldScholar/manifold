import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream } from "react-dom/server";
import { Provider } from "react-redux";
import createStore from "store/createStore";
import { setStore } from "store/storeInstance";

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

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let currentStatusCode = responseStatusCode;

    const { pipe, abort } = renderToPipeableStream(
      <Provider store={store}>
        <ServerRouter context={routerContext} url={request.url} />
      </Provider>,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(createReadableStreamFromReadable(body), {
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
