const isServer = typeof __SERVER__ === "undefined" || __SERVER__;
const isBrowser = !isServer;
const name = process.env.NODE_ENV.toLowerCase() || "development";

const baseConfig = {
  isBrowser,
  isServer,
  name
};

const environmentSpecificConfig = {
  development: {
    isProduction: false,
    isDevelopment: true
  },
  production: {
    isProduction: true,
    isDevelopment: true
  }
}[name];

export default Object.assign({}, baseConfig, environmentSpecificConfig);
