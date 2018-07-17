/* eslint-disable no-console */
import "babel-polyfill";
import config from "./config";
import ch from "./helpers/consoleHelpers";
import React from "react";
import ReactDOM from "react-dom/server";
import Html from "./helpers/Html";
import App from "./App";
import createStore from "./store/createStore";
import webServer from "./servers/common/server";
import webApp from "./servers/common/app";
import readStats from "./servers/common/readStats";
import cookie from "cookie";
import { currentUserActions } from "actions";
import exceptionRenderer from "./helpers/exceptionRenderer";
import Manifold from "containers/Manifold";
import { isPromise } from "utils/promise";
import isFunction from "lodash/isFunction";
import has from "lodash/has";
import { matchRoutes } from "react-router-config";
import { createLocation } from "history";
import getRoutes from "/routes";

// Node 8.x on Ubuntu 18 leads to failed SSL handshakes. Setting this
// default TLS value appears to fix this. I believe this issue has
// been addressed in Node 10.x, and in theory we can remove this once
// we no longer need to support Node 8 and 9.
// See https://github.com/nodejs/node/issues/21513
// See https://github.com/nodejs/node/issues/16196#issuecomment-393091912
const tls = require('tls');
tls.DEFAULT_ECDH_CURVE = "auto"

let port;
let socket;
if (process.env.WEBPACK_DEV_SERVER) {
  port = config.clientFallbackPort;
} else {
  socket = config.clientSocket;
  port = config.clientPort;
}
const stats = readStats("Client");

const respondWithRedirect = (res, redirectLocation) => {
  res.writeHead(302, {
    Location: redirectLocation,
    "Content-Length": "0"
  });
  res.end();
};

const render = (req, res, store) => {
  store.dispatch({ type: "SERVER_LOADED", payload: req.originalUrl });

  const routingContext = {
    fetchDataPromises: []
  };
  const appComponent = (
    <App staticContext={routingContext} staticRequest={req} store={store} />
  );

  let renderString = "";
  let isError = false;
  try {
    renderString = ReactDOM.renderToString(
      <Html component={appComponent} stats={stats} store={store} />
    );
  } catch (renderError) {
    isError = true;
    ch.error("Server-side render failed in server-react.js");
    renderString = exceptionRenderer(
      renderError,
      "ERROR: Server-side render failed in server-react.js"
    );
  } finally {
    // Redirect if the routing context has a url prop.
    if (routingContext.url) {
      respondWithRedirect(res, routingContext.url);
    } else {
      const state = store.getState();
      if (has(state, "notifications.fatalError.status")) {
        res.statusCode = state.notifications.fatalError.status;
      }
      if (isError) {
        res.statusCode = 302;
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
  const location = req.url;
  const routes = getRoutes();
  const branch = matchRoutes(routes, location);
  const promises = branch.reduce((allPromises, matchedRoute) => {
    const component = matchedRoute.route.component;
    if (isFunction(component.fetchData)) {
      const result = component.fetchData(
        store.getState,
        store.dispatch,
        createLocation(location, {}, "SSR", null),
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

const bootstrap = (req, store) => {
  const manifoldCookie = cookie.parse(req.headers.cookie || "");
  return Manifold.bootstrap(store.getState, store.dispatch, manifoldCookie);
};

// Handle requests
const requestHandler = (req, res) => {
  const store = createStore();

  if (req.headers.cookie) {
    const manifoldCookie = cookie.parse(req.headers.cookie || "");
    const authToken = manifoldCookie.authToken;
    if (authToken) store.dispatch(currentUserActions.login({ authToken }));
  }

  // Prior to the router upgrade, we handled these cases... may no
  // longer be necessary.
  // if (error) return respondWithRouterError(res, error);
  // if (!props) return respondWithInternalServerError(res);

  // 1. Authenticate user
  // 2. Fetch any data, as the user
  // 3. Send the response to the user
  /* eslint-disable max-len */
  bootstrap(req, store)
    .then(
      () => {
        ch.info("App bootstrapped", "sparkles");
        return fetchRouteData(req, store);
      },
      () => {
        ch.error("App bootstrap failed", "rain_cloud");
        return fetchRouteData(req, store);
      }
    )
    .then(
      () => {
        ch.info("Route data fetched", "sparkles");
        render(req, res, store);
      },
      () => {
        ch.error("Unable to fetch route data", "rain_cloud");
        render(req, res, store);
      }
    );
};

// Create the app and the server
const app = webApp("client");
app.use(requestHandler);
webServer(app, "client", { socket, port });
