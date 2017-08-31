import Express from "express";
import morgan from "morgan";
import favicon from "serve-favicon";
import path from "path";
import config from "../../config";
import ch from "../../helpers/consoleHelpers";
import proxy from "http-proxy-middleware";
import capitalize from "lodash/capitalize";

export default function webApp(name, optionsIgnored = {}) {
  const devLogFormat = `[${name}] :method :url :status :response-time ms`;
  const logStyle =
    process.env.NODE_ENV === "development" ? devLogFormat : "combined";
  const app = new Express();
  const clientAssetPort = config.assetPort;
  const assetTarget = `http://localhost:${clientAssetPort}`;
  const wwwPath = path.join(__dirname, "../www");

  ch.info(capitalize(`${name} server has been initialized.`));

  app.use(morgan(logStyle));
  app.use(favicon(path.join(__dirname, "/../../static/favicon.ico")));
  if (process.env.WEBPACK_DEV_SERVER) {
    const assetProxy = proxy({ target: assetTarget, logLevel: "silent" });
    app.use(["/build", "/static", /.*hot-update.*$/], assetProxy);
    ch.info(
      capitalize(
        `${name} server will proxy /build requests to ${assetTarget}/build.`
      )
    );
    ch.info(
      capitalize(
        `${name} server will proxy /static requests to ${assetTarget}/static.`
      )
    );
    ch.info(
      capitalize(
        `${name} server will proxy HMR related requests to ${assetTarget}.`
      )
    );
  } else {
    app.use(Express.static(wwwPath));
    app.use("/static", Express.static(`${wwwPath}/static`));
    app.use("/build", Express.static(`${wwwPath}/build`));
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
