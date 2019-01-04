/* eslint-disable no-console */
/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */

import "@babel/polyfill";
import "theme";
import React from "react";
import ReactDOM from "react-dom";
import App from "global/containers/App";
import ch from "./helpers/consoleHelpers";
import config from "config";

// The DOM element into which we're rendering the client-side SPA
const rootElement = document.getElementById("content");

if (!window.DISABLE_BROWSER_RENDER) {
  ReactDOM.hydrate(<App />, rootElement);
}

if (config.environment.isDevelopment) {
  // If we're in development mode, we want to check for the server-side render being
  // different from the first client-side render.
  window.React = React; // enable debugger
  window.manifoldConfig = config;
  if (rootElement && rootElement.hasAttribute("data-ssr-render") === true) {
    ch.info("Server-side rendering service is present.", "rainbow");
  } else {
    ch.error("Server-side rendering service is missing.", "rain_cloud");
  }
}
