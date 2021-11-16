import baseConfig from "./ssr-base.config";
import merge from "webpack-merge";
import nodeExternals from "webpack-node-externals";

const config = merge(baseConfig, {
  devtool: "source-map",

  // In dev, we can leave node modules as dynamic requires for the server-side bundle.
  // We do include emotion, however, so we can monkey patch its first-child warning.
  externals: [nodeExternals({ modulesFromFile: true, allowlist: [/^@emotion/] })]
});

export default config;
