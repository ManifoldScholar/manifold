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
import { resetServerContext as resetDndServerContext } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createCache from "@emotion/cache";
import { createServerFetchDataContext } from "hooks/api/contexts/InternalContext";
import { createStaticHandler, createStaticRouter } from "react-router";
import createRouter from "./routes/createRouter";
import { setStore } from "store/storeInstance";

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

  const stats = readStats("Client");

  // Set store instance for SSR loaders
  setStore(store);

  // Create v6 static router for SSR
  const routes = createRouter();
  // Pass store in context so loaders can access it
  const handler = createStaticHandler(routes, {
    basename: "/",
    context: { store }
  });

  // Query the handler to get the context for the current request
  // Bootstrap has already completed, so authentication state is available
  const context = await handler.query(
    new Request(`http://localhost${req.url}`)
  );

  // Handle redirects from context
  if (
    context instanceof Response &&
    context.status >= 300 &&
    context.status < 400
  ) {
    const redirectUrl = context.headers.get("Location");
    return respondWithRedirect(res, redirectUrl);
  }

  // Create static router with the context
  const staticRouter = createStaticRouter(routes, context);

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
          staticContext={context instanceof Response ? routingContext : context}
          staticRequest={req}
          staticRouter={staticRouter}
          store={store}
        />
      </CacheProvider>
    </ServerFetchDataContext>
  );

  resetDndServerContext();

  let renderString = "";
  let isError = false;

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
    // Handle redirect Response objects thrown by components
    if (
      renderError instanceof Response &&
      renderError.status >= 300 &&
      renderError.status < 400
    ) {
      const redirectUrl = renderError.headers.get("Location");
      return respondWithRedirect(res, redirectUrl);
    }

    isError = true;
    ch.error("Server-side render failed in server-react.js");
    const errorComponent = exceptionRenderer(renderError);
    renderString = fatalErrorOutput(errorComponent, store);
  } finally {
    const state = store.getState();

    // Redirect if the routing context has a url prop.
    if (routingContext.url) {
      respondWithRedirect(res, routingContext.url);
    }
    // After migrating global/containers/Manifold to functional component we no longer hit the catch
    // Move 401 check here
    else if (req.method === "GET" && state.fatalError?.error?.status === 401) {
      respondWithRedirect(res, `/login?redirect_uri=${req.url}`);
    } else {
      if (has(state, "fatalError.error.status")) {
        res.statusCode = state.fatalError.error.status;
        if (res.statusCode !== 403) {
          const errorComponent = <FatalError fatalError={state.fatalError} />;
          renderString = fatalErrorOutput(errorComponent, store);
        }
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
