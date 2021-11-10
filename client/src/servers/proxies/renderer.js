import config from "config";
import proxy from "http-proxy-middleware";
import ch from "../../helpers/consoleHelpers";
import createStore from "../../store/createStore";
import exceptionRenderer from "../../helpers/exceptionRenderer";
import manifoldBootstrap from "bootstrap";
import CookieHelper from "helpers/cookie/Server";

const ssrRenderUrl = `http://${config.services.client.domain}:${config.services.client.sparePort}`;

export default function makeRendererProxy(requestHandler) {
  const reactServerProxy = proxy({
    target: ssrRenderUrl,
    changeOrigin: true,
    logLevel: "silent",

    onError: (err, req, res) => {
      ch.error(`Error proxying to port ${ssrRenderUrl}`);
      ch.error(`Perhaps the SSR service is in the process of reloading?`);
      ch.error(`Falling back to SSR rescue service only`);

      const store = createStore();

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
              `Rendering fallback failed to render inn server-developmet.js`
            );
            res.setHeader("Content-Type", "text/html");
            res.end(exceptionRenderer(error));
          }
        }
      };

      const promises = [];
      const cookie = new CookieHelper(req, res);
      promises.push(manifoldBootstrap(store.getState, store.dispatch, cookie));
      Promise.all(promises).then(render, render);
    }
  });
  return reactServerProxy;
}
