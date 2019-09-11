import React from "react";
import { wrapWithRouter } from "./routing";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

export default function(component, store = {}) {
  return wrapWithRouter(
    <HelmetProvider context={{}}>
      <Provider store={store}>{component}</Provider>
    </HelmetProvider>
  );
}
