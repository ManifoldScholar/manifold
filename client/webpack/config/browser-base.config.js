import baseConfig from "./base.config";
import { DefinePlugin, ProvidePlugin } from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
const ManifestPlugin = require("../plugins/manifest");
import paths from "../helpers/paths";
import environment from "../helpers/environment";
const compileEnv = require("../transforms/env");
import path from "path";
import merge from "webpack-merge";

const config = merge(baseConfig("web"), {
  entry: {
    "build/manifold-client-browser": ["./src/entry-browser.js"]
  },

  // Browser javascript is written into the www folder in the dist directory.
  output: {
    path: path.join(paths.build, "www")
  },

  plugins: [
    new DefinePlugin({
      __BROWSER__: true,
      __SERVER__: false
    }),

    // In production, make sure react knows to remove dead code, and uglify output.
    new DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(environment.name)
    }),

    // Manifest is used by the server-side application to figure out what hashed css and
    // js files should be included in the HTML markup.
    new ManifestPlugin({
      fileName: "manifest.json"
    }),

    new CopyWebpackPlugin({
      // We always want to include the env.js file in the client build. This file is
      // loaded by the client, and it provides an environment of sorts for the browser
      // code.
      patterns: [
        {
          from: "webpack/templates/www_env.ejs",
          to: `${paths.build}/www/browser.config.js`,
          transform: compileEnv
        }
      ]
    }),

    new ProvidePlugin({ Buffer: ["buffer", "Buffer"] })
  ]
});

export default config;
