import { PassThrough, Transform } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { renderToPipeableStream, renderToString } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import FatalError from "components/global/FatalError";
import formatError from "lib/react-router/helpers/formatError";
import GlobalStyles, {
  rawCss as globalRawCss
} from "theme/styles/globalStyles";

import "utils/i18n";

const ABORT_DELAY = 5_000;

export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  routerContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let currentStatusCode = responseStatusCode;
    const sheet = new ServerStyleSheet();

    const jsx = sheet.collectStyles(
      <ServerRouter context={routerContext} url={request.url} />
    );

    const { pipe, abort } = renderToPipeableStream(jsx, {
      onShellReady() {
        shellRendered = true;
        const body = new PassThrough();

        // `interleaveWithNodeStream` prepends a <style> tag before <html>,
        // which the browser's parser reparents to the first position of
        // <head>, breaking React's expected head ordering and causing
        // hydration mismatches. Instead, buffer the stream until </head>
        // and inject collected style tags there — same pattern the prior
        // Emotion extractor used.
        let headInjected = false;
        let buffer = "";
        const injector = new Transform({
          transform(chunk, _enc, cb) {
            if (headInjected) {
              this.push(chunk);
              cb();
              return;
            }
            buffer += chunk.toString("utf8");
            const headCloseIdx = buffer.indexOf("</head>");
            if (headCloseIdx === -1) {
              cb();
              return;
            }
            const styleTags = sheet.getStyleTags();
            this.push(buffer.slice(0, headCloseIdx));
            this.push(styleTags);
            this.push(buffer.slice(headCloseIdx));
            buffer = "";
            headInjected = true;
            cb();
          },
          flush(cb) {
            if (!headInjected && buffer) this.push(buffer);
            cb();
          }
        });

        const output = new PassThrough();
        output.write("<!DOCTYPE html>");
        body.pipe(injector).pipe(output);

        const webStream = createReadableStreamFromReadable(output);

        const sealOnce = () => {
          sheet.seal();
        };
        output.once("close", sealOnce);
        output.once("error", sealOnce);

        responseHeaders.set("Content-Type", "text/html");
        resolve(
          new Response(webStream, {
            headers: responseHeaders,
            status: currentStatusCode
          })
        );

        pipe(body);
      },
      onShellError(error) {
        // Render a styled error page when the shell fails to render,
        // before React Router's error boundary can catch it.
        try {
          const errorProps = formatError(error);
          const errorSheet = new ServerStyleSheet();

          try {
            const errorHtml = renderToString(
              errorSheet.collectStyles(
                <html lang="en">
                  <head>
                    <meta charSet="utf-8" />
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1"
                    />
                    {/* Raw CSS in a virtual-DOM <style> survives React's
                        singleton head reconciliation where createGlobalStyle's
                        imperatively injected rules may not. */}
                    <style>{globalRawCss}</style>
                  </head>
                  <body className="browse">
                    <GlobalStyles />
                    <div id="content">
                      <FatalError {...errorProps} />
                    </div>
                  </body>
                </html>
              )
            );

            const styleTags = errorSheet.getStyleTags();
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
          } finally {
            errorSheet.seal();
          }
        } catch (renderError) {
          console.error("Failed to render error page:", renderError);
          sheet.seal();
          reject(error);
        }
      },
      onError(error) {
        currentStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      }
    });

    setTimeout(abort, ABORT_DELAY);
  });
}
