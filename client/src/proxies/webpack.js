import proxy from 'http-proxy-middleware';
import config from '../config';

export default function createApiProxy() {
  return proxy(config.assetProxyPaths, {
    target: `http://localhost:${config.assetPort}`,
    changeOrigin: true
  });
}

