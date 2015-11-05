import proxy from 'http-proxy-middleware';
import config from '../config';

export default function createApiProxy() {
  const apiUrl = config.apiUri;
  const apiPort = config.apiPort;
  const apiTarget = `${apiUrl}:${apiPort}`;
  const apiProxyPaths = config.apiProxyPaths;
  return proxy(apiProxyPaths, {
    target: apiTarget,
    changeOrigin: true
  });
}
