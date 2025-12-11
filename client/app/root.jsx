import { useMemo } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRevalidator,
  useRouteError
} from "react-router";
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
import { formatError } from "global/components/FatalError/Boundary";
import FatalError from "global/components/FatalError";
import { useColorScheme } from "hooks";

// Middleware and contexts
import { bootstrapMiddleware } from "./middleware/bootstrap.server";
import { clientBootstrapMiddleware } from "./middleware/bootstrap.client";
import { routerContext, AppContext } from "./contexts";

export { shouldRevalidate } from "helpers/router/shouldRevalidate";

// Export middleware
export const middleware = [bootstrapMiddleware];
export const clientMiddleware = [clientBootstrapMiddleware];

// Loader reads from middleware context and returns data for component
export const loader = ({ context }) => {
  return context.get(routerContext);
};

// Root ErrorBoundary - catches loader errors and uncaught render errors
export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error</title>
      </head>
      <body>
        <FatalError fatalError={formatError(error)} />
      </body>
    </html>
  );
}

export default function Root({ loaderData }) {
  const revalidator = useRevalidator();
  const { auth, settings, pages } = loaderData;

  useColorScheme();

  const typekitId = get(settings, "attributes.theme.typekitId");

  const appContextValue = useMemo(
    () => ({
      settings,
      auth,
      pages,
      revalidate: revalidator.revalidate
    }),
    [settings, auth, pages, revalidator.revalidate]
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
