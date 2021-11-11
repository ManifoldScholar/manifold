/* eslint-disable no-console */
/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import "@babel/polyfill";
import "focus-visible";
import React from "react";
import ReactDOM from "react-dom";
import App from "global/containers/App";
import ch from "./helpers/consoleHelpers";
import config from "config";
import manifoldBootstrap from "./bootstrap";
import has from "lodash/has";
import createStore from "store/createStore";
import CookieHelper from "helpers/cookie/Browser";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

class EntryBrowser {
  constructor() {
    this.initialState = window.__INITIAL_STATE__ || {};
    this.bootstrapped = has(window, "__INITIAL_STATE__");
    this.store = createStore(this.initialState);
  }

  get root() {
    return document.getElementById("content");
  }

  get ssrIsPresent() {
    return this.root && this.root.hasAttribute("data-ssr-render") === true;
  }

  startBootstrap(callback) {
    return new Promise(callback);
  }

  performBootstrap() {
    const store = this.store;
    const cookie = new CookieHelper();
    ch.error("Initializing client application...", "rain_cloud");
    return manifoldBootstrap(store.getState, store.dispatch, cookie).catch(
      e => {
        console.log(e, "Bootstrap failed.");
      }
    );
  }

  bootstrapUnnecessary(resolve) {
    ch.info("Client application initialized on server.", "sparkles");
    resolve();
  }

  bootstrapSuccess(resolve) {
    ch.info("Client application initialized.", "sparkles");
    resolve();
  }

  bootstrapFailure(reject) {
    ch.error("Client application initialization failure.", "fire");
    reject();
  }

  enableDevelopment() {
    // If we're in development mode, we want to check for the server-side render being
    // different from the first client-side render.
    window.React = React; // enable debugger
    window.manifoldConfig = config;
    if (this.ssrIsPresent) {
      ch.info("Server-side rendering service is present.", "rainbow");
    } else {
      ch.error("Server-side rendering service is missing.", "rain_cloud");
    }
  }

  render = () => {
    const cache = createCache({ key: "emotion" });
    const renderMethod = this.ssrIsPresent ? ReactDOM.hydrate : ReactDOM.render;
    renderMethod(
      <CacheProvider value={cache}>
        <App store={this.store} />
      </CacheProvider>,
      this.root
    );
    if (config.environment.isDevelopment) this.enableDevelopment();
  };

  start() {
    if (window.DISABLE_BROWSER_RENDER) return;
    this.startBootstrap((resolve, reject) => {
      if (this.bootstrapped) {
        return this.bootstrapUnnecessary(resolve);
      }
      this.performBootstrap().then(
        () => this.bootstrapSuccess(resolve),
        () => this.bootstrapFailure(reject)
      );
    }).finally(this.render);
  }
}

const entryBrowser = new EntryBrowser();
entryBrowser.start();
