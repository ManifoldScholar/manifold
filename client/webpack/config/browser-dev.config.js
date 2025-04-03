import baseConfig from "./browser-base.config";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { mergeWithRules } from "webpack-merge";
import environment from "../helpers/environment";
import paths from "../helpers/paths";

const allowedHosts = [
  "manifold.lvh",
  "localhost",
  "127.0.0.1",
  "manifold-dev.lvh",
  "manifold-stable.lvh",
  "manifold-dev.ngrok.io"
];
if (process.env.DOMAIN) allowedHosts.push(process.env.DOMAIN);

const browserConfig = {
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

  devServer: {
    hot: true,
    liveReload: false,
    host: process.env.DOMAIN || "localhost",
    allowedHosts,
    port: environment.devPort,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    },
    static: {
      directory: paths.root
    }
  },
  plugins: [
    new ReactRefreshWebpackPlugin({
      overlay: {
        sockHost: process.env.DOMAIN || "localhost",
        sockPort: environment.devPort
      }
    })
  ],

  optimization: {
    moduleIds: "named"
    // runtimeChunk: "single"
  }
};

const config = mergeWithRules({
  module: {
    rules: {
      test: "match",
      exclude: "replace",
      use: {
        loader: "match",
        options: "replace"
      }
    }
  }
})(baseConfig, browserConfig);

export default config;
