import baseConfig from "./browser-base.config";
import {
  HotModuleReplacementPlugin,
} from "webpack";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { mergeWithRules} from "webpack-merge";
import environment from "../helpers/environment";
import paths from "../helpers/paths";

const browserConfig = {
  // entry: {
  //   "build/manifold-client-browser": [
  //     "webpack/hot/only-dev-server",
  //     `webpack-dev-server/client/index.js?hot=true&live-reload=false&port=3012`
  //   ]
  // },

  entry: {
    "build/manifold-client-browser": []
  },

  devtool: "eval-cheap-module-source-map",

  mode: "development",
  module: {
    rules: [
      // Javascript loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [paths.src, paths.plugins],
        use: [
          {
            loader: require.resolve("babel-loader"),
            options: {
              cacheDirectory: true,
              plugins: [require.resolve("react-refresh/babel")]
            }
          }
        ]
      }
    ]
  },

  // devServer: {
  //   hot: false,
  //   client: false,
  //   headers: {
  //     "Access-Control-Allow-Origin": "*",
  //     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  //     "Access-Control-Allow-Headers":
  //       "X-Requested-With, content-type, Authorization"
  //   }
  // },
  optimization: {
    moduleIds: 'named',
    runtimeChunk: 'single'
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockPort: environment.devPort,
        sockHost: process.env.DOMAIN || "localhost"
      }
    })
  ]
}

const config = mergeWithRules({
  module: {
    rules: {
      test: "match",
      exclude: "replace",
      use: {
        loader: "match",
        options: "replace",
      },
    },
  },
})(baseConfig, browserConfig)

// const util = require('util')
// console.log(util.inspect(config, {showHidden: false, depth: null, colors: true}))

export default config;
