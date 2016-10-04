import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './helpers/Html';
import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import PrettyError from 'pretty-error';
import http from 'http';
import cookie from 'cookie';
import { match } from 'react-router';
import emoji from 'node-emoji';
import chalk from 'chalk';
import config from './config';
import proxy from 'http-proxy-middleware';
import createStore from './store/createStore';
import { authActions } from 'actions';

const morgan = require('morgan');
const app = new Express();
const server = new http.Server(app);
const logStyle = __DEVELOPMENT__ ? 'dev' : 'combined';

export default function (parameters) {

  app.use(compression());
  app.use(morgan(logStyle));

  if (__DEVELOPMENT__) {
    const assetProxy = proxy({
      target: `http://localhost:${config.assetPort}`,
    });
    app.use(['/build'], assetProxy);
    const staticPath = path.join(__dirname, '..', '..', '..', '..', 'static');
    console.log(staticPath);
    app.use('/static', Express.static(staticPath));
  }

  const reactServerProxy = proxy({
    target: `http://localhost:${config.reactServerPort}`,
    changeOrigin: true,
    onError: (err, req, res) => {

      const store = createStore();

      if (req.headers.cookie) {
        const manifoldCookie = cookie.parse(req.headers.cookie);
        const authToken = manifoldCookie.authToken;
        store.dispatch(authActions.setAuthToken(authToken));
        store.dispatch(authActions.getCurrentUser);
      }

      // res.writeHead(200, {
      //   'Content-Type': 'text/html'
      // });
      res.send('<!doctype html>\n' +
        ReactDOM.renderToString(<Html
          assets={parameters.chunks()}
          store={store}
        />));
    }
  });
  app.use('/', reactServerProxy);

  const listenOn = config.webServerPort;
  server.listen(listenOn, (err) => {
    if (err) {
      console.error(err);
    }
  });

}
