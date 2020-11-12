/* eslint-disable no-console */
import config from "config";
import ch from "./helpers/consoleHelpers";
import React from "react";
import ReactDOM from "react-dom/server";
import Html from "./helpers/Html";
import App from "global/containers/App";
import createStore from "./store/createStore";
import webServer from "./servers/common/server";
import webApp from "./servers/common/app";
import readStats from "./servers/common/read-stats";
import CookieHelper from "helpers/cookie/Server";
import exceptionRenderer from "./helpers/exceptionRenderer";
import manifoldBootstrap from "./bootstrap";
import { isPromise } from "utils/promise";
import isFunction from "lodash/isFunction";
import has from "lodash/has";
import { matchRoutes } from "react-router-config";
import { createLocation } from "history";
import getRoutes from "/routes";
import FatalError from "global/components/FatalError";

// Node 8.x on Ubuntu 18 leads to failed SSL handshakes. Setting this
// default TLS value appears to fix this. I believe this issue has
// been addressed in Node 10.x, and in theory we can remove this once
// we no longer need to support Node 8 and 9.
// See https://github.com/nodejs/node/issues/21513
// See https://github.com/nodejs/node/issues/16196#issuecomment-393091912
const tls = require("tls");

tls.DEFAULT_ECDH_CURVE = "auto";

const socket = config.services.client.rescueEnabled
  ? null
  : config.services.client.socket;
const port = config.services.client.rescueEnabled
  ? config.services.client.sparePort
  : config.services.client.port;
const stats = readStats("Client");

const respondWithRedirect = (res, redirectLocation) => {
  res.writeHead(302, {
    Location: redirectLocation,
    "Content-Length": "0"
  });
  res.end();
};

const fatalErrorOutput = (errorComponent, store) => {
  return ReactDOM.renderToString(
    <Html
      component={errorComponent}
      disableBrowserRender
      stats={stats}
      store={store}
    />
  );
};

const render = (req, res, store) => {
  store.dispatch({ type: "SERVER_LOADED", payload: req.originalUrl });

  const routingContext = {
    fetchDataPromises: []
  };

  const helmetContext = {};
  const appComponent = (
    <App
      helmetContext={helmetContext}
      staticContext={routingContext}
      staticRequest={req}
      store={store}
    />
  );

  let renderString = "";
  let isError = false;

  try {
    renderString = ReactDOM.renderToString(
      <Html
        helmetContext={helmetContext}
        component={appComponent}
        stats={stats}
        store={store}
      />
    );
  } catch (renderError) {
    isError = true;
    ch.error("Server-side render failed in server-react.js");
    const errorComponent = exceptionRenderer(renderError);
    renderString = fatalErrorOutput(errorComponent, store);
  } finally {
    // Redirect if the routing context has a url prop.
    if (routingContext.url) {
      respondWithRedirect(res, routingContext.url);
    } else {
      const state = store.getState();
      if (has(state, "fatalError.error.status")) {
        res.statusCode = state.fatalError.error.status;
        const errorComponent = <FatalError fatalError={state.fatalError} />;
        renderString = fatalErrorOutput(errorComponent, store);
      }
      if (isError) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html");
        res.end(renderString);
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end("<!doctype html>\n" + renderString);
      }
    }
  }
};

const fetchRouteData = (req, store) => {
  const routes = getRoutes();
  const location = createLocation(req.url, {}, "SSR", null);
  const branch = matchRoutes(routes, location.pathname);
  const promises = branch.reduce((allPromises, matchedRoute) => {
    const component = matchedRoute.route.component;
    if (isFunction(component.fetchData)) {
      const result = component.fetchData(
        store.getState,
        store.dispatch,
        location,
        matchedRoute.match
      );
      if (isPromise(result)) {
        allPromises.push(result);
      }
      if (Array.isArray(result)) {
        result.forEach(aResult => {
          if (isPromise(aResult)) allPromises.push(aResult);
        });
      }
      return allPromises;
    }
    return allPromises;
  }, []);
  promises.forEach(promise => {
    promise.catch(resp => {
      ch.error(
        `API Error ${resp.status} ${resp.statusText}: ${resp.request.endpoint}`,
        "rain_cloud"
      );
    });
  });
  return Promise.all(promises);
};

const performBootstrap = (req, res, store) => {
  const cookie = new CookieHelper(req, res);
  const location = createLocation(req.url, {}, "SSR", null);
  return manifoldBootstrap(store.getState, store.dispatch, cookie, location);
};

// Handle requests
const requestHandler = (req, res) => {
  const store = createStore();

  // Prior to the router upgrade, we handled these cases... may no
  // longer be necessary.
  // if (error) return respondWithRouterError(res, error);
  // if (!props) return respondWithInternalServerError(res);

  // 1. Run manifold bootstrap
  // 2. Fetch any data, as the user
  // 3. Send the response to the user
  /* eslint-disable max-len */
  performBootstrap(req, res, store)
    .then(
      () => {
        ch.plain("App bootstrapped");
        return fetchRouteData(req, store);
      },
      () => {
        ch.error("App bootstrap failed", "rain_cloud");
        return fetchRouteData(req, store);
      }
    )
    .then(
      () => {
        ch.plain("Route data fetched");
        render(req, res, store);
      },
      () => {
        ch.error("Unable to fetch route data", "rain_cloud");
        render(req, res, store);
      }
    );
};

// Create the app and the server
// If the server isn't running alongside the rescue server (in a development env), then we
// will proxy some asset and API routes. Ideally, in production, these are delivered by a
// webserver like nginx, and not through this node process.
const doProxy =
  !config.services.client.rescueEnabled &&
  config.services.client.proxiesEnabled;
const app = webApp("SSR", { proxyProdAssets: doProxy, proxyAPI: doProxy });
app.use(requestHandler);
webServer(app, "SSR", { socket, port });
