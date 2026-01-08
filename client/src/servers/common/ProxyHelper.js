import ch from "../../helpers/consoleHelpers";
import proxy from "http-proxy-middleware";
import config from "config";
import isRegExp from "lodash/isRegExp";
import serveStatic from "serve-static";
import path from "path";

const proxyDebug = process.env.PROXY_DEBUG === "true";

class ProxyHelper {
  constructor(name) {
    this.name = name;
    this.apiAssetTarget = config.services.api;
    this.assetTarget = `http://localhost:${config.services.client.assetPort}`;
    this.wwwTarget = path.join(__dirname, "..", "www");
  }

  proxyOptions(proxyPath, target, logLevel) {
    const options = {
      target,
      logLevel: proxyDebug ? logLevel : "silent",
      changeOrigin: true,
      onError: (err, req, res) => {
        ch.error(
          `[Proxy Error] ${this.name} | ${proxyPath} -> ${target} | ${req.method} ${req.url}`
        );
        ch.error(`[Proxy Error] ${err.message}`);
        ch.error(err.stack);
      }
    };

    if (proxyDebug) {
      options.onProxyReq = (proxyReq, req) => {
        const clientIp =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        ch.info(
          `[Proxy Req] ${this.name} | ${req.method} ${req.url} -> ${target}${req.url} | IP: ${clientIp}`
        );
      };
      options.onProxyRes = (proxyRes, req) => {
        ch.info(
          `[Proxy Res] ${this.name} | ${req.method} ${req.url} | Status: ${proxyRes.statusCode}`
        );
        if (proxyRes.headers.location) {
          ch.info(`[Proxy Res] Redirect Location: ${proxyRes.headers.location}`);
        }
      };
    }

    return options;
  }

  proxyAPIPaths(app) {
    this.defineProxy(app, "/system", this.apiAssetTarget);
    this.defineProxy(app, "/api/proxy", this.apiAssetTarget);
  }

  proxyBrowserPathsToDevServer(app) {
    this.defineProxy(app, "/browser.config.js", this.assetTarget);
    this.defineProxy(app, "/build", this.assetTarget);
    this.defineProxy(app, "/static", this.assetTarget);
    this.defineProxy(app, "/ws", this.assetTarget);
    this.defineProxy(app, /.*hot-update.*$/, this.assetTarget);
  }

  proxyBrowserPathsToDistDirectory(app) {
    this.defineStaticProxy(
      app,
      "/browser.config.js",
      `${this.wwwTarget}/browser.config.js`,
      { maxAge: "1h" }
    );
    this.defineStaticProxy(app, "/build", `${this.wwwTarget}/build`, {
      maxAge: "1y",
      immutable: true
    });
    this.defineStaticProxy(app, "/static", `${this.wwwTarget}/static`, {
      maxAge: "1h"
    });
  }

  defineStaticProxy(app, proxyPath, target, serveStaticOptions = {}) {
    ch.background(
      `${this.name} server will proxy ${proxyPath} requests to ${target}.`
    );
    app.use(proxyPath, serveStatic(target, serveStaticOptions));
  }

  defineProxy(app, proxyPath, target, logLevel = "debug") {
    if (isRegExp(proxyPath))
      return this.defineRegExpProxy(app, proxyPath, target, logLevel);
    ch.background(
      `${this.name} server will proxy ${proxyPath} requests to ${target}.`
    );
    app.use(proxyPath, proxy(this.proxyOptions(proxyPath, target, logLevel)));
  }

  defineRegExpProxy(app, proxyPath, target, logLevel = "debug") {
    const theProxy = proxy(this.proxyOptions(proxyPath, target, logLevel));
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
