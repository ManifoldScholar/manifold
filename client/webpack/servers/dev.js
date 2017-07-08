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
  ch.header(`Client-side assets have finished building (${ms}ms)`);
});

compiler.plugin("compile", params => {
  timer = +new Date();
  ch.info("Client-side assets are being built");
});

const serverOptions = {
  quiet: false,
  allowedHosts: ["manifold.dev", "localhost", "127.0.0.1"],
  noInfo: false,
  hot: true,
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
