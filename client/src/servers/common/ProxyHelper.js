import ch from "../../helpers/consoleHelpers";
import proxy from "http-proxy-middleware";
import config from "config";
import isRegExp from "lodash/isRegExp";
import serveStatic from "serve-static";
import path from "path";

class ProxyHelper {
  constructor(name) {
    this.name = name;
    this.apiAssetTarget = config.services.api;
    this.assetTarget = `http://localhost:${config.services.client.assetPort}`;
    this.wwwTarget = path.join(__dirname, "..", "www");
  }

  proxyAPIPaths(app) {
    this.defineProxy(app, "/system", this.apiAssetTarget);
    this.defineProxy(app, "/api/proxy", this.apiAssetTarget);
  }

  proxyBrowserPathsToDevServer(app) {
    this.defineProxy(app, "/browser.config.js", this.assetTarget);
    this.defineProxy(app, "/build", this.assetTarget);
    this.defineProxy(app, "/static", this.assetTarget);
    this.defineProxy(app, /.*hot-update.*$/, this.assetTarget);
  }

  proxyBrowserPathsToDistDirectory(app) {
    this.defineStaticProxy(
      app,
      "/browser.config.js",
      `${this.wwwTarget}/browser.config.js`
    );
    this.defineStaticProxy(app, "/build", `${this.wwwTarget}/build`);
    this.defineStaticProxy(app, "/static", `${this.wwwTarget}/static`);
  }

  defineStaticProxy(app, proxyPath, target) {
    ch.background(
      `${this.name} server will proxy ${proxyPath} requests to ${target}.`
    );
    app.use(proxyPath, serveStatic(target));
  }

  defineProxy(app, proxyPath, target, logLevel = "silent") {
    if (isRegExp(proxyPath))
      return this.defineRegExpProxy(app, proxyPath, target, logLevel);
    ch.background(
      `${this.name} server will proxy ${proxyPath} requests to ${target}.`
    );
    app.use(proxyPath, proxy({ target, logLevel }));
  }

  defineRegExpProxy(app, proxyPath, target, logLevel = "silent") {
    const theProxy = proxy({ target, logLevel });
    ch.background(
      `${
        this.name
      } server will proxy ${proxyPath.toString()} requests to ${target}.`
    );
    app.use((req, res, next) => {
      return proxyPath.test(req.url.toLowerCase())
        ? theProxy(req, res, next)
        : next();
    });
  }
}

export default ProxyHelper;
