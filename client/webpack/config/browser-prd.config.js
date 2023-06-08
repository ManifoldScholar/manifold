import baseConfig from "./browser-base.config";
import merge from "webpack-merge";
import CopyWebpackPlugin from "copy-webpack-plugin";
import paths from "../helpers/paths";
import compileEnv from "../transforms/env";

const config = merge(baseConfig, {
  plugins: [
    // Unless we're running the webpack dev server, we need to copy static assets into
    // the build.
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "static",
          to: `${paths.build}/www/static`,
          cache: true
        }
      ]
    })
  ]
});

export default config;
