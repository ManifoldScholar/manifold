import { useMemo } from "react";
import PropTypes from "prop-types";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StaticRouterProvider } from "react-router";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Global as GlobalStyles } from "@emotion/react";
import styles from "theme/styles/globalStyles";
import "utils/i18n";
import { UIDReset } from "react-uid";
import createRouter from "routes/createRouter";
import { setStore } from "store/storeInstance";

export default function App({
  store,
  staticContext,
  staticRequest,
  helmetContext = {},
  staticRouter
}) {
  // Create router for client-side (only if not SSR)
  const browserRouter = useMemo(() => {
    if (!staticRequest) {
      setStore(store);
      const routes = createRouter();
      return createBrowserRouter(routes);
    }
    return null;
  }, [staticRequest, store]);

  // Router provider - SSR uses StaticRouterProvider, client uses RouterProvider
  // Both render the matched route directly (no children)
  const routerProvider =
    staticRequest && staticRouter ? (
      <StaticRouterProvider router={staticRouter} context={staticContext} />
    ) : (
      <RouterProvider router={browserRouter} />
    );

  return (
    <Provider store={store} key="provider">
      <UIDReset prefix="uid_">
        <HelmetProvider context={helmetContext}>
          <GlobalStyles styles={styles} />
          {routerProvider}
        </HelmetProvider>
      </UIDReset>
    </Provider>
  );
}

App.propTypes = {
  store: PropTypes.object,
  staticContext: PropTypes.object,
  staticRequest: PropTypes.object,
  helmetContext: PropTypes.object,
  staticRouter: PropTypes.object
};
