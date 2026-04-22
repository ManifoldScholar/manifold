import { useMemo } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import GlobalStyles from "theme/styles/globalStyles";
import { get } from "lodash-es";
import Analytics from "contexts/Analytics";
import Utility from "components/global/utility";
import LoadingBar from "components/global/LoadingBar";
import CookiesBanner from "components/global/CookiesBanner";
import { NavigationBlockerProvider } from "components/global/router/NavigationBlockerContext";
import { SignInUpOverlayProvider } from "components/global/sign-in-up/Overlay/context";
import { useColorScheme } from "hooks";
import { ErrorBoundary } from "./RootErrorBoundary";

// Middleware and contexts
// eslint-disable-next-line import/extensions
import { bootstrapMiddleware } from "lib/middleware/bootstrap.server";
import { routerContext, AppContext } from "contexts";
import NotificationProvider from "contexts/NotificationProvider";

// Export middleware
export const middleware = [bootstrapMiddleware];

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
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
        <GlobalStyles />
        <div id="content">
          <AppContext.Provider value={appContextValue}>
            <NotificationProvider>
              <HelmetProvider>
                <Analytics>
                  <div role="presentation" className="global-container">
                    <Utility.SkipLink />
                    <div id="global-notification-container" />
                    <div id="global-overlay-container" />
                    <NavigationBlockerProvider>
                      <SignInUpOverlayProvider>
                        <LoadingBar />
                        <Outlet />
                        <CookiesBanner />
                      </SignInUpOverlayProvider>
                    </NavigationBlockerProvider>
                  </div>
                </Analytics>
              </HelmetProvider>
            </NotificationProvider>
          </AppContext.Provider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
