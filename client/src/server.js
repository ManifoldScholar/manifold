import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import { pad } from './utils/string';
import PrettyError from 'pretty-error';
import http from 'http';
import cookie from 'cookie';
import { match } from 'react-router';
import RedBox from 'redbox-react';
import emoji from 'node-emoji';
import chalk from 'chalk';

import config from './config';
import Html from './helpers/Html';
import createStore from './store/createStore';
import { setAuthToken } from './actions/shared/authentication';


import getStatusFromRoutes from './helpers/getStatusFromRoutes';
import fetchAllData from './helpers/fetchAllData';
import App from './App';import getRoutes from './routes';

const morgan = require('morgan');
const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const logStyle = __DEVELOPMENT__ ? 'dev' : 'combined';

function handleError(error) {
  console.log(`SERVER RENDER ERROR`);
  console.log('---------------------');
  console.log(pretty.render(error));
  return ReactDOM.renderToString(
    <RedBox error={error} />
  );
}

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use(require('serve-static')(path.join(__dirname, '..', 'static')));
app.use(morgan(logStyle));

app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  const store = createStore();

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  if (req.headers.cookie) {
    const manifoldCookie = cookie.parse(req.headers.cookie);
    const authToken = manifoldCookie.authToken;
    store.dispatch(setAuthToken(authToken));
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
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (!props) {
      res.status(500);
      hydrateOnClient();
    } else {
      fetchAllData(
        props.components,
        store.getState, store.dispatch,
        props.location,
        props.params
      ).then(() => {
        store.dispatch({ type: 'SERVER_LOADED', payload: req.originalUrl });
        const appComponent = (
          <App {...props} store={store} />
        );

        const status = getStatusFromRoutes(props.routes);
        if (status) {
          res.status(status);
        }

        let renderString = '';
        try {
          renderString = ReactDOM.renderToString(
            <Html
              assets={webpackIsomorphicTools.assets()}
              component={appComponent}
              store={store}
            />
          );
        } catch (renderError) {
          renderString = handleError(renderError);
        } finally {
          res.send('<!doctype html>\n' + renderString);
        }
      }, (error) => {
        renderString = handleError(error);
        console.log('test return error!!!');
        res.send('<!doctype html>\n' + renderString);
      });
    }
  });
});

const socketLocation = process.env.NODE_SERVER_SOCKET_PATH;
let listenOn;
let setUmask = false;
let oldUmask;
if (socketLocation) {
  listenOn = socketLocation;
  setUmask = true;
  oldUmask = process.umask('0000');
} else {
  listenOn = config.clientPort;
}

const header = (str) => { return chalk.bold.green.bold(pad(str, 80, ' ', false)); };
const info = (str) => { return chalk.bold.cyan(str); };


if (listenOn) {
  server.listen(listenOn, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('');
    console.log('');
    if (!config.isProduction) {
      console.log(header(emoji.get('tada') + '  MANIFOLD WEBPACK SERVER'));
      console.log(info(pad('', 79, '-')));
      console.log(info('Manifold Asset Server, a.k.a. Webpack, is listening at http://127.0.0.1:%s'), config.assetPort);
      console.log('');
      console.log('');
    }

    console.log(header(emoji.get('earth_americas') + '  MANIFOLD REST API'));
    console.log(info(pad('', 79, '-')));
    console.log(info('The Manifold client expects to find the API at the following paths:'));
    console.log('');
    const apiPathMax = config.apiProxyPaths.reduce((memo, current) => {
      return current.length > memo ? current.length : memo;
    }, 0);
    config.apiProxyPaths.forEach((value) => {
      console.log(info(`${config.apiUri}${value}`));
    });
    console.log('');
    console.log('');

    console.log(header(emoji.get('books') + '  UNIVERSAL CLIENT SERVER'));
    console.log(info(pad('', 79, '-')));
    console.log(info(`Manifold Client is listening at http://127.0.0.1:${config.clientPort}`));
    console.log('');
    console.log('');
    if (setUmask === true) {
      process.umask(oldUmask);
    }
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
