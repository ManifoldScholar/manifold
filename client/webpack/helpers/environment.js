import path from "path";
import dotenv from "dotenv"

dotenv.config({ path: path.join(__dirname, "../../../.env") });

// Require instead of import to ensure that the env has been loaded, above.
const config = require("../../src/config").default;

// Declare some useful constants.
const name = config.environment.name;
const isBuild = process.env.IS_BUILD;
const production = config.environment.isProduction;
const development = config.environment.isDevelopment;
const buildIn = process.env.BUILD_IN || "";
const devPort = config.services.client.assetPort
const devUrl = `http://${config.services.client.domain}:${devPort}`;

export default {
  name,
  production,
  development,
  buildIn,
  isBuild,
  devPort,
  devUrl
};
