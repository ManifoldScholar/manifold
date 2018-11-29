import config from "config";
import proxy from "http-proxy-middleware";
import ch from "../../helpers/consoleHelpers";
import createStore from "../../store/createStore";
import cookie from "cookie";
import has from "lodash/has";
import exceptionRenderer from "../../helpers/exceptionRenderer";
import Manifold from "Manifold";
import { authenticateWithToken } from "store/middleware/currentUserMiddleware";

const clientFallbackPort = `http://localhost:${config.clientFallbackPort}`;

export default function makeRendererProxy(stats, requestHandler) {
  const reactServerProxy = proxy({
    target: clientFallbackPort,
    changeOrigin: true,
    logLevel: "silent",

    onError: (err, req, res) => {
      ch.error(`Error proxying to port ${clientFallbackPort}`);
      ch.error(
        `Perhaps the React rendering service is in the process of reloading?`
      );
      ch.error(`Falling back to client-side render only`);

      const store = createStore();

      let authToken = null;
      if (req.headers.cookie) {
        const manifoldCookie = cookie.parse(req.headers.cookie);
        authToken = manifoldCookie.authToken;
      }

      const render = () => {
        try {
          requestHandler(req, res);
        } catch (error) {
          if (error.code === "MODULE_NOT_FOUND") {
            const msg =
              "Waiting for initial Webpack build to complete. Wait a few seconds " +
              "and reload.";
            ch.error(msg);
            res.setHeader("Content-Type", "text/html");
            res.end(msg);
          } else {
            ch.error(
              `Rendering fallback failed to render in server-development.js`
            );
            res.setHeader("Content-Type", "text/html");
            res.end(exceptionRenderer(error));
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
  return reactServerProxy;
}
