require("dotenv").config({ path: "../.env" });

const path = require("path");
const paths = require("./paths");
const webpack = require("webpack");
const base = require("./base.config");
const rimraf = require("rimraf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("./plugins/manifest");
const compileEnv = require("./transforms/env");
const ch = require("../src/helpers/consoleHelpers");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

const targetDir = process.env.WEBPACK_BUILD_TARGET
  ? process.env.WEBPACK_BUILD_TARGET
  : "";
const buildDir = path.resolve(
  paths.root,
  targetDir,
  paths.relativeOutput,
  "www"
);

// No hashes in development env.
const nameTemplate =
  process.env.NODE_ENV === "development" ? "[name]" : "[name]-[hash]";

// Declare plugins early.
const plugins = [];
const devtool = process.env.WEBPACK_DEV_SERVER
  ? "cheap-module-eval-source-map"
  : "source-map";

const config = {
  // Webpack mocks node's global "process". We don't want it to in this case, because
  // we're mocking it ourselves via the .env file that we generate for the client.
  node: { process: false },

  entry: {
    "build/client": ["./src/client.js"],
    "build/theme": ["./src/theme/theme.js"]
  },

  output: {
    chunkFilename: `build/chunk-${nameTemplate}.js`,
    path: buildDir,
    publicPath: "/",
    filename: `${nameTemplate}.js`
  },

  devtool
};

// HMR
if (process.env.WEBPACK_DEV_SERVER && !process.env.DISABLE_HMR) {
  ch.info("Webpack dev server is running. Enabling HMR.");

  config.devServer = {
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization"
    }
  };

  config.entry["build/client"].unshift("webpack/hot/only-dev-server");
  config.entry["build/client"].unshift(
    `webpack-dev-server/client?http://0.0.0.0:${process.env.CLIENT_ASSET_PORT}`
  );
  config.entry["build/client"].unshift("react-hot-loader/patch");
  const hotPlugin = new webpack.HotModuleReplacementPlugin();
  plugins.push(hotPlugin);

  const namedModules = new webpack.NamedModulesPlugin();
  plugins.push(namedModules);
}

// We define two simple globals to determine if Webpack is building for the client or the
// server. These strings (eg, __CLIENT__) will be replaced with the value in the built
// code.
const globals = new webpack.DefinePlugin({
  __CLIENT__: true,
  __SERVER__: false
});
plugins.push(globals);

// Unless we're running the webpack dev server, we need to copy static assets into the
// build.
const copyEntries = [];
if (!process.env.WEBPACK_DEV_SERVER) {
  copyEntries.push({
    from: "static",
    to: `${buildDir}/static`
  });
}

// We always want to include the env.js file in the client build. This file is loaded by
// the client, and it provides an environment of sorts for the browser code.
copyEntries.push({
  from: "webpack/templates/www_env.ejs",
  to: `${buildDir}/browser.config.js`,
  transform: compileEnv
});

const copyFiles = new CopyWebpackPlugin(copyEntries);
plugins.push(copyFiles);

// We write a manifest with the names of the built client files. This allows the server-
// side application to get the correct paths.
const manifest = new ManifestPlugin({ fileName: "manifest.json" });
plugins.push(manifest);

const options = {
  plugins
};

const finalConfig = Object.assign({}, base(options), config);
rimraf.sync(finalConfig.output.path);

module.exports = finalConfig;
