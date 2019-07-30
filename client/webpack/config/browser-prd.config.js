import baseConfig from "./browser-base.config";
import merge from "webpack-merge";
import CopyWebpackPlugin from "copy-webpack-plugin";
import paths from "../helpers/paths";

const config = merge(baseConfig, {
  plugins: [
    new CopyWebpackPlugin([
      // Unless we're running the webpack dev server, we need to copy static assets into
      // the build.
      {
        from: "static",
        to: `${paths.build}/www/static`,
        cache: true
      }
    ])
  ]
});

export default config;
