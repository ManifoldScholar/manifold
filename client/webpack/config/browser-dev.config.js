import baseConfig from "./browser-base.config";
import {
  DefinePlugin,
  HotModuleReplacementPlugin,
  NamedModulesPlugin
} from "webpack";
import merge from "webpack-merge";
import environment from "../helpers/environment";

const config = merge.smart(baseConfig, {
  entry: {
    "build/manifold-client-browser": [
      "webpack/hot/only-dev-server",
      `webpack-dev-server/client?http://0.0.0.0:${environment.devPort}`
    ]
  },

  devtool: "cheap-module-eval-source-map",

  devServer: {
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    }
  },

  plugins: [new HotModuleReplacementPlugin(), new NamedModulesPlugin()]
});

export default config;
