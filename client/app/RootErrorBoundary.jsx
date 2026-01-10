import { useRouteError, useLoaderData, Links, Scripts } from "react-router";
import { Global as GlobalStyles } from "@emotion/react";
import styles from "theme/styles/globalStyles";
import get from "lodash/get";
import { formatError } from "global/components/FatalError/Boundary";
import FatalError from "global/components/FatalError";

// Root ErrorBoundary - catches loader errors and uncaught render errors
export function ErrorBoundary() {
  const error = useRouteError();
  // Get loaderData for settings (typekit, etc.) - may be undefined if error in root loader
  const loaderData = useLoaderData();
  const settings = loaderData?.settings;
  const typekitId = settings
    ? get(settings, "attributes.theme.typekitId")
    : null;

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
      </head>
      <body>
        <GlobalStyles styles={styles} />
        <div>Root Error Boundary</div>
        <div id="content">
          <FatalError fatalError={formatError(error)} />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
