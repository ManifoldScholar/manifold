import {
  useRouteError,
  useLoaderData,
  Scripts,
  Meta,
  useLocation
} from "react-router";
import { rawCss as globalRawCss } from "theme/styles/globalStyles";
import { get } from "lodash-es";
import formatError from "lib/react-router/helpers/formatError";
import FatalError from "components/global/FatalError";

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
        {/* Global CSS as a virtual-DOM <style> element — survives React's
            singleton head reconciliation, which can strip imperatively
            injected <style> tags that the render tree didn't author. */}
        <style>{globalRawCss}</style>
        <Meta />
      </head>
      <body className="browse">
        <div id="content">
          <FatalError {...errorProps} />
        </div>
        <Scripts />
      </body>
    </html>
  );
}
