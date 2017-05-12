import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import http from 'http';
import cookie from 'cookie';
import config from './config';
import Html from './helpers/Html';
import ch from './helpers/consoleHelpers';
import createStore from './store/createStore';
import { currentUserActions } from 'actions';
import exceptionRenderer from './helpers/exceptionRenderer';
import App from './App';
import Manifold from 'containers/Manifold';
import { authenticateWithToken } from 'store/middleware/currentUserMiddleware';
import { isPromise } from 'utils/promise';
import isFunction from 'lodash/isFunction';
import has from 'lodash/has';
import { matchRoutes } from 'react-router-config';
import getRoutes from '/routes';

const pretty = new PrettyError();

function respondWithRedirect(res, redirectLocation) {
  res.redirect(redirectLocation);
  return;
}

function respondWithSSRDisabledError(res) {
  res.status(500);
  res.send("Server side rendering is disabled");
  return;
}

function authenticateUser(req, store) {
  if (req.headers.cookie) {
    const manifoldCookie = cookie.parse(req.headers.cookie);
    const authToken = manifoldCookie.authToken;
    if (authToken) return authenticateWithToken(authToken, store.dispatch);
    return Promise.resolve();
  }
  return Promise.resolve();
}

function render(req, res, store, parameters) {
  ch.info("Server-side data fetch completed successfully");
  store.dispatch({ type: 'SERVER_LOADED', payload: req.originalUrl });

  const routingContext = {
    fetchDataPromises: []
  };
  const appComponent = (
    <App
      staticContext={routingContext}
      staticRequest={req}
      store={store}
    />
  );

  let renderString = '';
  let isError = false;
  try {
    renderString = ReactDOM.renderToString(
      <Html
        component={appComponent}
        assets={parameters.chunks()}
        store={store}
      />
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
      return respondWithRedirect(res, routingContext.url);
    }

    if (isError) {
      res.status(500);
      res.send(renderString);
    } else {
      res.send('<!doctype html>\n' + renderString);
    }
  }
}

function fetchRouteData(req, store) {
  const location = req.url;
  const routes = getRoutes();
  const branch = matchRoutes(routes, location);
  const promises = branch.reduce((allPromises, matchedRoute) => {
    const component = matchedRoute.route.component;
    if (isFunction(component.fetchData)) {
      const result = component.fetchData(
        store.getState,
        store.dispatch,
        location,
        matchedRoute.match
      );
      if (isPromise(result)) allPromises.push(result);
      if (Array.isArray(result)) {
        result.forEach((aResult) => {
          if (isPromise(aResult)) allPromises.push(aResult);
        });
      }
      return allPromises;
    }
    return allPromises;
  }, []);
  return Promise.all(promises);
}

function bootstrap(req, store) {
  const promises = [];
  if (!has(store.getState(), "entityStore.entities.settings.0")) {
    promises.push(Manifold.bootstrap(store.getState, store.dispatch));
  }
  return Promise.all(promises);
}

export default function (parameters) {

  const morgan = require('morgan');
  const app = new Express();
  const server = new http.Server(app);
  const devLogFormat = "[UNV] :method :url :status :response-time ms - :res[content-length]";
  const logStyle = __DEVELOPMENT__ ? devLogFormat : 'combined';

  app.use(morgan(logStyle));

  app.use((req, res) => {

    const store = createStore();

    if (__DISABLE_SSR__) return respondWithSSRDisabledError(res);

    if (req.headers.cookie) {
      const manifoldCookie = cookie.parse(req.headers.cookie);
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
    bootstrap(req, store).then(
      () => { return authenticateUser(req, store); },
      () => { return authenticateUser(req, store); },
    ).then(
      () => { console.log('test a'); return fetchRouteData(req, store); },
      () => { console.log('test b'); return fetchRouteData(req, store); }
    ).then(
      () => { render(req, res, store, parameters); },
      () => { render(req, res, store, parameters); }
    );
  });

  const listenOn = config.universalServerPort;
  if (listenOn) {
    server.listen(listenOn, (err) => {
      if (err) {
        ch.error("Universal server encountered an error.");
        console.error('SERVER ERROR:', pretty.render(err));
      }
      ch.header(`Manifold Universal Server engaged on port ${config.universalServerPort}`);
    });
  } else {
    ch.error(`No CLIENT_UNIVERSAL_SERVER_PORT environment variable has been specified`);
  }

  process.once('SIGUSR2', () => {
    ch.info("The Universal Server has received a restart signal. Hang tight!");
    ch.info("   While it's being restarted, there will be no server-side rendering.", null);
    process.kill(process.pid, 'SIGUSR2');
  });

}
