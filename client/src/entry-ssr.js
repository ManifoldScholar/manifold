/* eslint-disable no-console */
import config from "config";
import ch from "./helpers/consoleHelpers";
import React from "react";
import ReactDOM from "react-dom/server";
import HtmlBody from "./helpers/HtmlBody";
import wrapHtmlBody from "./helpers/wrapHtmlBody";
import App from "global/containers/App";
import createStore from "./store/createStore";
import webServer from "./servers/common/server";
import webApp from "./servers/common/app";
import readStats from "./servers/common/read-stats";
import CookieHelper from "helpers/cookie/Server";
import exceptionRenderer from "./helpers/exceptionRenderer";
import manifoldBootstrap from "./bootstrap";
import has from "lodash/has";
import FatalError from "global/components/FatalError";
import { resetServerContext as resetDndServerContext } from "react-beautiful-dnd";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { createServerFetchDataContext } from "hooks/api/contexts/InternalContext";

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

const respondWithRedirect = (res, redirectLocation) => {
  res.writeHead(302, {
    Location: redirectLocation,
    "Content-Length": "0"
  });
  res.end();
};

const fatalErrorOutput = (errorComponent, store) => {
  const stats = readStats("Client");
  return ReactDOM.renderToString(
    <HtmlBody
      component={errorComponent}
      disableBrowserRender
      stats={stats}
      store={store}
    />
  );
};

const render = async (req, res, store) => {
  store.dispatch({ type: "SERVER_LOADED", payload: req.originalUrl });

  const routingContext = {};
  const helmetContext = {};

  const cache = createCache({ key: "emotion" });
  const {
    extractCriticalToChunks,
    constructStyleTagsFromChunks
  } = createEmotionServer(cache);

  const {
    ServerFetchDataContext,
    isFetchingComplete
  } = createServerFetchDataContext();

  const appComponent = (
    <ServerFetchDataContext>
      <CacheProvider value={cache}>
        <App
          helmetContext={helmetContext}
          staticContext={routingContext}
          staticRequest={req}
          store={store}
        />
      </CacheProvider>
    </ServerFetchDataContext>
  );

  resetDndServerContext();

  let renderString = "";
  let isError = false;

  const stats = readStats("Client");

  try {
    ch.notice("Rendering application on server.", "floppy_disk");
    ReactDOM.renderToString(
      <HtmlBody component={appComponent} stats={stats} store={store} />
    );

    await isFetchingComplete();
    ch.notice("ResolveData completed.", "floppy_disk");

    renderString = ReactDOM.renderToString(
      <HtmlBody component={appComponent} stats={stats} store={store} />
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

      const chunks = extractCriticalToChunks(renderString);
      const styleTags = constructStyleTagsFromChunks(chunks);
      const htmlOutput = wrapHtmlBody({
        store,
        stats,
        styleTags,
        helmetContext,
        body: renderString
      });
      if (isError) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html");
        res.end(htmlOutput);
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end("<!doctype html>\n" + htmlOutput);
      }
    }
  }
};

const performBootstrap = (req, res, store) => {
  const cookie = new CookieHelper(req, res);
  return manifoldBootstrap(store.getState, store.dispatch, cookie);
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
  performBootstrap(req, res, store).then(
    () => {
      ch.plain("App bootstrapped");
      render(req, res, store);
    },
    () => {
      ch.error("App bootstrap failed", "rain_cloud");
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
