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
import { authActions } from 'actions';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';
import fetchAllData from './helpers/fetchAllData';
import App from './App';
import getRoutes from './routes';

const pretty = new PrettyError();

function handleError(error) {
  console.log(`SERVER RENDER ERROR`);
  console.log('---------------------');
  console.log(pretty.render(error));
  return ReactDOM.renderToString(
    <RedBox error={error} />
  );
}

export default function (parameters) {

  const morgan = require('morgan');
  const app = new Express();
  const server = new http.Server(app);
  const logStyle = __DEVELOPMENT__ ? 'dev' : 'combined';

  app.use(compression());

  // TODO: Deal with favicon
  // app.use(favicon(path.join(__dirname, '..', 'dist', 'static', 'favicon.ico')));
  // app.use(require('serve-static')(path.join(__dirname, '..', 'static')));

  app.use(morgan(logStyle));

  app.use((req, res) => {

    const store = createStore();

    const hydrateOnClient = () => {
      res.send('<!doctype html>\n' +
        ReactDOM.renderToString(<Html
          assets={parameters.chunks()}
          store={store}
        />));
    };

    //
    // if (__DISABLE_SSR__) {
    //   hydrateOnClient();
    //   return;
    // }

    if (req.headers.cookie) {
      const manifoldCookie = cookie.parse(req.headers.cookie);
      const authToken = manifoldCookie.authToken;
      store.dispatch(authActions.setAuthToken(authToken));
      store.dispatch(authActions.getCurrentUser);
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
                component={appComponent}
                assets={parameters.chunks()}
                store={store}
              />
            );
          } catch (renderError) {
            renderString = handleError(renderError);
          } finally {
            res.send('<!doctype html>\n' + renderString);
          }
        }, (dataFetchError) => {
          const renderString = handleError(dataFetchError);
          res.send('<!doctype html>\n' + renderString);
        });
      }
    });
  });

  const listenOn = config.reactServerPort;
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
      console.log(info(`Manifold Client is listening at http://127.0.0.1:${listenOn}`));
      console.log('');
      console.log('');
      // if (setUmask === true) {
      //   process.umask(oldUmask);
      // }
    });
  } else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
  }


}
