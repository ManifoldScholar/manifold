/* global $store, fixtures, $helmetContext, $store, $frontendContext */
import { wrapWithRouter } from "test/helpers/routing";
import {
  FrontendModeContext,
  ManifoldAnalyticsContext
} from "helpers/contexts";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import { i18n } from "utils/i18nTest";
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
          <ManifoldAnalyticsContext.Provider value={{ track: () => {} }}>
            <FrontendModeContext.Provider value={$frontendContext}>
              <I18nextProvider i18n={i18n}>{component}</I18nextProvider>
            </FrontendModeContext.Provider>
          </ManifoldAnalyticsContext.Provider>
        </Provider>
      </HelmetProvider>
    );
  };
});
