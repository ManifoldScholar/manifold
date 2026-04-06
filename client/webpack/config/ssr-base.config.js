import baseConfig from "./base.config";
import {
  DefinePlugin,
  BannerPlugin,
  NormalModuleReplacementPlugin,
  optimize
} from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import paths from "../helpers/paths";
import environment from "../helpers/environment";
import merge from "webpack-merge";
const compileEnv = require("../transforms/env");

const config = merge(baseConfig(["node", "browserslist"]), {
  entry: {
    "ssr/manifold-client-ssr": ["./src/entry-ssr.js"]
  },

  // No point in hashing the filename for the server-side application.
  output: {
    path: paths.build,
    chunkFilename: `chunk-[name].js`,
    filename: "[name].js"
  },

  node: {
    __dirname: false,
    __filename: false
  },

  devtool: false,

  plugins: [
    new DefinePlugin({
      __BROWSER__: false,
      __SERVER__: true,
      "process.env.NODE_ENV": JSON.stringify(environment.name)
    }),

    // The banner plugin appends javascript to the output bundle, which helps us with two
    // things:
    // 1) Support source maps in node in development environment
    // 2) Require the environment before any other code is loaded
    new BannerPlugin({
      banner: `require("./ssr.config.js");`,
      raw: true,
      entryOnly: false
    }),

    // No chunks on the server.
    new optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: "webpack/templates/node_env.ejs",
          to: `${paths.build}/ssr/ssr.config.js`,
          transform: compileEnv
        }
      ]
    })
  ]
});

export default config;
