import baseConfig from "./ssr-base.config";
import nodeExternals from "webpack-node-externals";

const config = {...baseConfig};
config.entry = {
  "ssr/manifold-client-ssr-rescue": ["./src/entry-ssr-rescue.js"]
};

// In dev, we can leave node modules as dynamic requires for the server-side bundle.
// We do include emotion, however, so we can monkey patch its first-child warning.
config.externals = [nodeExternals({ modulesFromFile: true, allowlist: [/^@emotion/] })]


export default config;
