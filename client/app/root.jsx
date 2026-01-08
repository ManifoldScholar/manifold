import { useMemo } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { Global as GlobalStyles } from "@emotion/react";
import styles from "theme/styles/globalStyles";
import get from "lodash/get";
import Analytics from "hoc/analytics";
import Utility from "global/components/utility";
import LoadingBar from "global/components/LoadingBar";
import SignInUp from "global/components/sign-in-up";
import CookiesBanner from "global/components/CookiesBanner";
import { NavigationBlockerProvider } from "global/components/router/NavigationBlockerContext";
import { useColorScheme } from "hooks";
import { ErrorBoundary } from "./RootErrorBoundary";

// Middleware and contexts
import { bootstrapMiddleware } from "./middleware/bootstrap.server";
import { clientBootstrapMiddleware } from "./middleware/bootstrap.client";
import { routerContext, AppContext } from "./contexts";

// Export middleware
export const middleware = [bootstrapMiddleware];
export const clientMiddleware = [clientBootstrapMiddleware];

// Loader reads from middleware context and returns data for component
export const loader = ({ context }) => {
  return context.get(routerContext);
};

export { ErrorBoundary };

export default function Root({ loaderData }) {
  const { auth, settings, pages } = loaderData;

  useColorScheme();

  const typekitId = get(settings, "attributes.theme.typekitId");

  const appContextValue = useMemo(
    () => ({
      settings,
      auth,
      pages
    }),
    [settings, auth, pages]
  );

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
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalStyles styles={styles} />
        <div id="content">
          <AppContext.Provider value={appContextValue}>
            <HelmetProvider>
              <Analytics>
                <div role="presentation" className="global-container">
                  <Utility.SkipLink />
                  <div id="global-notification-container" />
                  <div id="global-overlay-container" />
                  <NavigationBlockerProvider>
                    <LoadingBar />
                    <SignInUp.Overlay />
                    <Outlet />
                    <CookiesBanner />
                  </NavigationBlockerProvider>
                </div>
              </Analytics>
            </HelmetProvider>
          </AppContext.Provider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
