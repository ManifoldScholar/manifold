import baseConfig from "./ssr-base.config";
import nodeExternals from "webpack-node-externals";

const config = {...baseConfig};
config.entry = {
  "ssr/manifold-client-ssr-rescue": ["./src/entry-ssr-rescue.js"]
};
config.externals = [nodeExternals({ modulesFromFile: true })]

export default config;
