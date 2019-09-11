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
    isDevelopment: false
  }
}[name];

export default { ...baseConfig, ...environmentSpecificConfig };
