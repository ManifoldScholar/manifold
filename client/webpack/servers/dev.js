const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("../build-client.config");
const ch = require("../..//src/helpers/consoleHelpers");

const compiler = webpack(webpackConfig);
let timer;

compiler.plugin("done", stats => {
  const end = +new Date();
  const ms = end - timer;
  ch.header(`Client-side assets have finished building (${ms}ms).`);
});

compiler.plugin("compile", params => {
  timer = +new Date();
  ch.info("Client-side assets are being built.");
});

const isHot = !process.env.DISABLE_HMR;
const serverOptions = {
  quiet: false,
  allowedHosts: ["manifold.dev", "manifold.lvh", "localhost", "127.0.0.1"],
  noInfo: false,
  hot: isHot,
  inline: true,
  lazy: false,
  headers: { "Access-Control-Allow-Origin": "*" },
  stats: {
    modules: false,
    colors: true
  }
};

const server = new WebpackDevServer(compiler, serverOptions);
server.listen(process.env.CLIENT_ASSET_PORT);
