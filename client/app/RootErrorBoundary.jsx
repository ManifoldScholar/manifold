import {
  useRouteError,
  useLoaderData,
  Scripts,
  Meta,
  useLocation
} from "react-router";
import { useMemo, useLayoutEffect } from "react";
import { CacheProvider } from "@emotion/react";
import styles from "theme/styles/globalStyles";
import get from "lodash/get";
import formatError from "app/routes/utility/helpers/formatError";
import FatalError from "components/global/FatalError";
import { createEmotionCache } from "./utils/emotion-stream";

// Root ErrorBoundary - catches loader errors and uncaught render errors
export function ErrorBoundary() {
  const error = useRouteError();
  const location = useLocation();
  // Get loaderData for settings (typekit, etc.) - may be undefined if error in root loader
  const loaderData = useLoaderData();
  const settings = loaderData?.settings;
  const typekitId = settings
    ? get(settings, "attributes.theme.typekitId")
    : null;

  const errorProps = formatError(error, location.pathname);

  const cache = useMemo(() => createEmotionCache(), []);

  // React's singleton reconciliation of <head> removes Emotion's imperatively-injected
  // <style> elements because they aren't in the virtual DOM. Re-append any evicted
  // style tags after React commits — useLayoutEffect fires after DOM mutations but
  // before paint, so there's no flash of unstyled content.
  useLayoutEffect(() => {
    const { sheet } = cache;
    if (!sheet?.tags?.length) return;
    sheet.tags.forEach(tag => {
      if (!document.head.contains(tag)) {
        document.head.appendChild(tag);
      }
    });
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {typekitId && (
          <>
            <link
              rel="preconnect"
              href="https://use.typekit.net"
              crossOrigin=""
            />
            <link
              rel="preconnect"
              href="https://p.typekit.net"
              crossOrigin=""
            />
            <link
              rel="stylesheet"
              href={`https://use.typekit.net/${typekitId}.css`}
            />
          </>
        )}
        {/* Global CSS as a virtual DOM element — survives React's head reconciliation.
            styles.styles is the raw CSS string from the Emotion css`` template literal. */}
        <style>{styles.styles}</style>
        <Meta />
      </head>
      <body className="browse">
        <CacheProvider value={cache}>
          <div id="content">
            <FatalError {...errorProps} />
          </div>
        </CacheProvider>
        <Scripts />
      </body>
    </html>
  );
}
