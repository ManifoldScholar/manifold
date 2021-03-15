const isServer = typeof __SERVER__ === "undefined" || __SERVER__;
const isBrowser = !isServer;
const name = process.env.NODE_ENV.toLowerCase() || "development";
const skipSSR = process.env.SKIP_SSR || false;

const baseConfig = {
  isBrowser,
  isServer,
  name,
  skipSSR
};

const environmentSpecificConfig = {
  development: {
    isProduction: false,
    isDevelopment: true
  },
  production: {
    isProduction: true,
    isDevelopment: false
  }
}[name];

export default { ...baseConfig, ...environmentSpecificConfig };
