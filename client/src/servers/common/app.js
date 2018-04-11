import connect from "connect";
import serveStatic from "serve-static";
import morgan from "morgan";
import favicon from "serve-favicon";
import path from "path";
import config from "../../config";
import ch from "../../helpers/consoleHelpers";
import proxy from "http-proxy-middleware";
import capitalize from "lodash/capitalize";
import isString from "lodash/isString";
import isRegExp from "lodash/isRegExp";

export default function webApp(name, optionsIgnored = {}) {
  const devLogFormat = `[${name}] :method :url :status :response-time ms`;
  const logStyle =
    process.env.NODE_ENV === "development" ? devLogFormat : "combined";
  const app = connect();
  const clientAssetPort = config.assetPort;
  const assetTarget = `http://localhost:${clientAssetPort}`;
  const wwwPath = path.join(__dirname, "www");

  ch.info(capitalize(`${name} server has been initialized.`));

  app.use(morgan(logStyle));

  const faviconPath = path.join(__dirname, "www/static/favicon.ico");
  try {
    app.use(favicon(faviconPath));
  } catch (err) {
    if (err.code === "ENOENT") {
      ch.info(`No favicon found at ${faviconPath}`);
    } else {
      throw err;
    }
  }

  if (process.env.WEBPACK_DEV_SERVER) {
    const toProxy = [
      "/browser.config.js",
      "/build",
      "/static",
      /.*hot-update.*$/
    ];
    const assetProxy = proxy({ target: assetTarget, logLevel: "silent" });

    const assetproxyWrapper = (req, res, next) => {
      const reqPath = req.url.toLowerCase();
      const match = toProxy.find(route => {
        if (isString(route))
          return reqPath.substr(0, route.length) === route.toLowerCase();
        if (isRegExp(route)) return route.test(reqPath);
        return false;
      });
      if (match) return assetProxy(req, res, next);
      return next();
    };

    toProxy.forEach(target => {
      ch.info(
        capitalize(
          `${name} server will proxy ${target.toString()} requests to ${assetTarget}.`
        )
      );
    });
    app.use(assetproxyWrapper);
  } else {
    app.use(serveStatic(wwwPath));
    app.use("/build", serveStatic(`${wwwPath}/build`));
    app.use("/static", serveStatic(`${wwwPath}/static`));
    ch.info(
      capitalize(
        `${name} server will proxy /build requests to ${wwwPath}/build.`
      )
    );
    ch.info(
      capitalize(
        `${name} server will proxy /static requests to ${wwwPath}/static.`
      )
    );
  }

  return app;
}
