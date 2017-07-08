import proxy from "http-proxy-middleware";
import config from "../config";

export default function createApiProxy() {
  return proxy(config.apiProxyPaths, {
    target: config.apiUrl,
    changeOrigin: true
  });
}
