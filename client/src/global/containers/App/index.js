import { useMemo } from "react";
import PropTypes from "prop-types";
import {
  createBrowserRouter,
  RouterProvider,
  StaticRouter
} from "react-router-dom";
import { Provider } from "react-redux";
import Manifold from "global/containers/Manifold";
import { HelmetProvider } from "react-helmet-async";
import { Global as GlobalStyles } from "@emotion/react";
import styles from "theme/styles/globalStyles";
import "utils/i18n";
import { UIDReset } from "react-uid";
import createRouter from "routes/createRouter";

export default function App({
  store,
  staticContext,
  staticRequest,
  helmetContext = {}
}) {
  // Create v6 router for client-side (only if not SSR)
  // Use useMemo to ensure router is only created once
  const router = useMemo(() => {
    if (!staticRequest) {
      const routes = createRouter();
      return createBrowserRouter(routes, {
        future: {
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }
      });
    }
    return null;
  }, [staticRequest]);

  // SSR still uses v5 StaticRouter for now
  // Will be migrated to v6 StaticRouterProvider later
  if (staticRequest) {
    return (
      <Provider store={store} key="provider">
        <UIDReset prefix="uid_">
          <StaticRouter context={staticContext} location={staticRequest.url}>
            <HelmetProvider context={helmetContext}>
              <GlobalStyles styles={styles} />
              <Manifold />
            </HelmetProvider>
          </StaticRouter>
        </UIDReset>
      </Provider>
    );
  }

  // Client-side uses v6 RouterProvider
  // RouterProvider renders the matched route directly (no children)
  return (
    <Provider store={store} key="provider">
      <UIDReset prefix="uid_">
        <HelmetProvider context={helmetContext}>
          <GlobalStyles styles={styles} />
          <RouterProvider router={router} />
        </HelmetProvider>
      </UIDReset>
    </Provider>
  );
}

App.propTypes = {
  store: PropTypes.object,
  staticContext: PropTypes.object,
  staticRequest: PropTypes.object,
  helmetContext: PropTypes.object
};
