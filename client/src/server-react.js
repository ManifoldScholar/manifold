import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import http from 'http';
import cookie from 'cookie';
import { match } from 'react-router';
import config from './config';
import Html from './helpers/Html';
import ch from './helpers/consoleHelpers';
import createStore from './store/createStore';
import { currentUserActions } from 'actions';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';
import fetchAllData from './helpers/fetchAllData';
import exceptionRenderer from './helpers/exceptionRenderer';
import App from './App';
import getRoutes from './routes';
import { authenticateWithToken } from 'store/middleware/currentUserMiddleware';

const pretty = new PrettyError();

function respondWithRouterError(res, error) {
  ch.error("The server-side render experienced a routing error.");
  console.error('ROUTER ERROR:', pretty.render(error));
  res.status(500);
  res.send("Internal Server Error");
}

function respondWithRedirect(res, redirectLocation) {
  res.redirect(redirectLocation.pathname + redirectLocation.search);
  return;
}

function respondWithInternalServerError(res) {
  res.status(500);
  res.send("Internal Server Error");
  return;
}

function respondWithSSRDisabledError(res) {
  res.status(500);
  res.send("Server side rendering is disabled");
  return;
}

function fetchComponentData(props, store) {
  return fetchAllData(
    props.components,
    store.getState, store.dispatch,
    props.location,
    props.params
  );
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

function render(req, res, store, props, parameters) {
  ch.info("Server-side data fetch completed successfully");
  store.dispatch({ type: 'SERVER_LOADED', payload: req.originalUrl });
  const appComponent = (
    <App {...props} store={store} />
  );
  const status = getStatusFromRoutes(props.routes);
  if (status) {
    res.status(status);
  }

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
    if (isError) {
      res.status(500);
      res.send(renderString);
    } else {
      res.send('<!doctype html>\n' + renderString);
    }
  }
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
      store.dispatch(currentUserActions.login({ authToken }));
    }

    match({
      routes: getRoutes(store),
      location: req.url
    }, (error, redirectLocation, props) => {

      // We want the full location to be available to components even during server-side render.
      // Not sure this is the best way to accomplish this.
      if (props) {
        store.dispatch({
          type: '@@router/UPDATE_LOCATION',
          payload: props.location
        });
      }

      if (redirectLocation) return respondWithRedirect(res, redirectLocation);
      if (error) return respondWithRouterError(res, error);
      if (!props) return respondWithInternalServerError(res);

      // 1. Authenticate user
      // 2. Fetch any data, as the user
      // 3. Send the response to the user
      authenticateUser(req, store).then(
        () => { return fetchComponentData(props, store); },
        () => { return fetchComponentData(props, store); }
      ).then(
        () => { render(req, res, store, props, parameters); },
        () => { render(req, res, store, props, parameters); }
      );
    });
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
    ch.error(`No MANIFOLD_REACT_SERVER_PORT environment variable has been specified`);
  }

  process.once('SIGUSR2', () => {
    ch.info("The Universal Server has received a restart signal. Hang tight!");
    ch.info("   While it's being restarted, there will be no server-side rendering.", null);
    process.kill(process.pid, 'SIGUSR2');
  });

}
