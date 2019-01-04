import connect from "connect";
import morgan from "morgan";
import ProxyHelper from "./ProxyHelper";
import config from "config";

export default function webApp(
  name,
  options = { proxyAPI: false, proxyDevAssets: false, proxyProdAssets: false }
) {
  const devLogFormat = `[${name}] :method :url :status :response-time ms`;
  const logStyle = config.environment.isDevelopment ? devLogFormat : "combined";
  const app = connect();

  const proxyHelper = new ProxyHelper(name);

  app.use(morgan(logStyle));

  if (options.proxyAPI) {
    proxyHelper.proxyAPIPaths(app);
  }

  if (options.proxyDevAssets) {
    proxyHelper.proxyBrowserPathsToDevServer(app);
  } else if (options.proxyProdAssets) {
    proxyHelper.proxyBrowserPathsToDistDirectory(app);
  }

  return app;
}
