import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './helpers/Html';
import exceptionRenderer from './helpers/exceptionRenderer';
import Express from 'express';
import favicon from 'serve-favicon';
import path from 'path';
import PrettyError from 'pretty-error';
import http from 'http';
import cookie from 'cookie';
import { match } from 'react-router-dom';
import config from './config';
import proxy from 'http-proxy-middleware';
import createStore from './store/createStore';
import { currentUserActions } from 'actions';
import { authenticateWithToken } from 'store/middleware/currentUserMiddleware';
import ch from './helpers/consoleHelpers';
import has from 'lodash/has';
import Manifold from 'containers/Manifold';

const morgan = require('morgan');
const app = new Express();
const server = new http.Server(app);
const devLogFormat = "[WEB] :method :url :status :response-time ms - :res[content-length]";
const logStyle = __DEVELOPMENT__ ? devLogFormat : 'combined';

export default function (parameters) {

  const pretty = new PrettyError();

  app.use(morgan(logStyle));
  app.use(favicon(__dirname + '/../../../../static/favicon.ico'));

  if (__DEVELOPMENT__) {

    const assetTarget = `http://localhost:${config.assetPort}`;
    const assetProxy = proxy({
      target: assetTarget,
      logLevel: 'silent'
    });
    app.use(['/build'], assetProxy);
    ch.info(`Proxying /build requests to ${assetTarget}`);

    const staticPath = path.join(__dirname, '..', '..', '..', '..', 'static');
    app.use('/static', Express.static(staticPath));
    ch.info(`Proxying /static requests to ${staticPath}`);
  }

  const universalTarget = `http://localhost:${config.universalServerPort}`;
  const reactServerProxy = proxy({
    target: universalTarget,
    changeOrigin: true,
    logLevel: 'silent',

    onError: (err, req, res) => {

      ch.error(`Error proxying to ${universalTarget}`);
      ch.error(`Perhaps the Universal server is in the process of reloading?`);
      ch.error(`Falling back to client-side render only`);

      const store = createStore();

      let authToken = null;
      if (req.headers.cookie) {
        const manifoldCookie = cookie.parse(req.headers.cookie);
        authToken = manifoldCookie.authToken;
      }

      const render = () => {
        try {
          res.send('<!doctype html>\n' +
            ReactDOM.renderToString(<Html
              assets={parameters.chunks()}
              store={store}
            />));
        } catch (error) {
          if (error.code === "MODULE_NOT_FOUND") {
            const msg = "Waiting for initial Webpack build to complete. Wait a few seconds " +
              "and reload.";
            ch.error(msg);
            res.send(msg);
          } else {
            ch.error(`Universal render fallback failed to render in server-web.js`);
            res.send(exceptionRenderer(error));
          }
        }
      };

      const promises = [];
      if (!has(store.getState(), "entityStore.entities.settings.0")) {
        promises.push(Manifold.bootstrap(store.getState, store.dispatch));
      }

      promises.push(authenticateWithToken(authToken, store.dispatch));
      Promise.all(promises).then(render, render);
    }
  });
  app.use('/', reactServerProxy);
  ch.info(`Proxying all other requests to the Universal rendering service at ${universalTarget}`);

  const socketLocation = config.webServerSocket;
  let listenOn;
  let setUmask = false;
  let oldUmask;
  if (socketLocation) {
    listenOn = socketLocation;
    setUmask = true;
    oldUmask = process.umask('0000');
  } else {
    listenOn = config.webServerPort;
  }

  server.listen(listenOn, (err) => {
    if (err) {
      ch.error("Web server encountered an error.");
      console.error('SERVER ERROR:', pretty.render(err));
    }
    ch.header(`Manifold Web server listening at ${listenOn}`);
  });

}
