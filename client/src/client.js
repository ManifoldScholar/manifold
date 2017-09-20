/* eslint-disable no-console */
/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
require("babel-polyfill");
require("es6-promise").polyfill();

import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./App";
import ch from "./helpers/consoleHelpers";

// The DOM element into which we're rendering the client-side SPA
const rootElement = document.getElementById("content");

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootElement
  );
};

render(App);

if (module.hot) {
  module.hot.accept("./App", () => {
    render(App);
  });
}

if (process.env.NODE_ENV === "development") {
  // If we're in development mode, we want to check for the server-side render being
  // different from the first client-side render.
  window.React = React; // enable debugger
  if (rootElement && rootElement.hasAttribute("data-ssr-render") === true) {
    ch.info("Server-side rendering service is present.", "rainbow");
    if (
      !rootElement ||
      !rootElement.firstChild ||
      !rootElement.firstChild.attributes ||
      !rootElement.firstChild.attributes["data-react-checksum"]
    ) {
      ch.error("Server-side rendering service does not match.", "rain_cloud");
    } else {
      ch.info("Server-side rendering service response matches.", "rainbow");
    }
  } else {
    ch.error("Server-side rendering service is missing.", "rain_cloud");
  }
}
