/* global $store, fixtures, $helmetContext, $store, $frontendContext */
import { wrapWithRouter } from "test/helpers/routing";
import { FrontendModeContext } from "helpers/contexts";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import React from "react";

// Deal with Helmet
HelmetProvider.canUseDOM = false;

def("store", () => fixtures.createStore());
def("state", () => $store.getState());
def("dispatch", () => $store.dispatch);
def("history", () => fixtures.history());
def("location", () => ({}));
def("frontendContext", () => ({ isLibrary: true, isStandalone: false }));
def("helmetContext", () => ({}));
def("withApp", () => {
  return component => {
    return wrapWithRouter(
      <HelmetProvider context={$helmetContext}>
        <Provider store={$store}>
          <FrontendModeContext.Provider value={$frontendContext}>
            {component}
          </FrontendModeContext.Provider>
        </Provider>
      </HelmetProvider>
    );
  };
});
