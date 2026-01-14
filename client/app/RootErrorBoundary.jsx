import {
  useRouteError,
  useLoaderData,
  Links,
  Scripts,
  Meta,
  isRouteErrorResponse,
  useLocation
} from "react-router";
import { useMemo } from "react";
import { Global as GlobalStyles, CacheProvider } from "@emotion/react";
import styles from "theme/styles/globalStyles";
import get from "lodash/get";
import { formatError } from "global/components/FatalError/Boundary";
import formatRouteError from "app/routes/utility/helpers/formatRouteError";
import FatalError from "global/components/FatalError";
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

  // Use formatRouteError for route error responses (404, 401, 403), otherwise use formatError
  const isRouteError = isRouteErrorResponse(error) && !!error.status;
  const errorProps = isRouteError
    ? formatRouteError(error, location.pathname)
    : {
        fatalError: formatError(error),
        hideStatus: false
      };

  // Create a cache for the error boundary - use useMemo to persist across re-renders
  // and ensure it injects into document.head on the client
  const cache = useMemo(() => {
    const errorCache = createEmotionCache();
    // On client side, ensure styles inject into document.head
    if (typeof document !== "undefined" && document.head) {
      // Emotion will automatically inject into document.head by default,
      // but we can ensure it's set up correctly
      if (errorCache.sheet) {
        errorCache.sheet.container = document.head;
      }
    }
    return errorCache;
  }, []);

  console.log({ cache });

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
        <Links />
        <Meta />
      </head>
      <body>
        <CacheProvider value={cache}>
          <GlobalStyles styles={styles} />
          <div>Root Error Boundary</div>
          <div id="content">
            <FatalError {...errorProps} />
          </div>
        </CacheProvider>
        <Scripts />
      </body>
    </html>
  );
}
