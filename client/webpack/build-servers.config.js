require("dotenv").config({ path: "../.env" });

const paths = require("./paths");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ManifestPlugin = require("./plugins/manifest");
const base = require("./base.config");
const nodeExternals = require("webpack-node-externals");
const rimraf = require("rimraf");
const compileEnv = require("./transforms/env");

const path = require("path");
const targetDir = process.env.WEBPACK_BUILD_TARGET
  ? process.env.WEBPACK_BUILD_TARGET
  : "";
const buildDir = path.resolve(
  paths.root,
  targetDir,
  paths.relativeOutput,
  "node"
);

const entries = {
  "server-client": "./src/server-client"
};

if (process.env.WEBPACK_DEV_SERVER) {
  entries["server-development"] = "./src/server-dev";
}

// Clean up build dir
rimraf.sync(buildDir);

const config = {
  entry: entries,
  target: "node",
  node: {
    __dirname: false,
    __filename: false
  },
  // The following line prevents webpack from bundling the modules into the output.
  // We may want to change this at some point, but for now, it seems to speed up
  // compilation.
  externals: [nodeExternals({ modulesFromFile: true })],
  devtool: "sourcemap",
  output: {
    chunkFilename: `chunk-[name].js`,
    path: buildDir,
    filename: "[name].js"
  }
};

if (process.env.WEBPACK_DEV_SERVER) {
  config.watch = true;
  config.watchOptions = {
    ignored: /node_modules/
  };
}

// The banner plugin appends javascript to the output bundle, which helps us with two
// things:
// 1) Support source maps in node
// 2) Require the environment before any other code is loaded
let bannerContents = "";
if (process.env.NODE_ENV == "development") {
  bannerContents += `require("source-map-support").install();`;
}
bannerContents += `\nrequire("./env");`;
const banner = new webpack.BannerPlugin({
  banner: bannerContents,
  raw: true,
  entryOnly: false
});

const copyFiles = new CopyWebpackPlugin([
  {
    from: "webpack/templates/node_env.ejs",
    to: `${buildDir}/env.js`,
    transform: compileEnv
  }
]);

const globals = new webpack.DefinePlugin({
  __CLIENT__: false,
  __SERVER__: true
});

const manifest = new ManifestPlugin({ fileName: "server.json" });

const plugins = [];
plugins.push(globals);
plugins.push(copyFiles);
plugins.push(manifest);
plugins.push(banner);

const finalConfig = Object.assign({}, base({ plugins }), config);
module.exports = finalConfig;
