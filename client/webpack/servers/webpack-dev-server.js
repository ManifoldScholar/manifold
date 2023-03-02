import environment from "../helpers/environment";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfig from "../config/browser-dev.config";
import ch from "../../src/helpers/consoleHelpers";

const compiler = webpack(webpackConfig);
let timer;

compiler.hooks.done.tap("ManifoldWebpackDevServer", stats => {
  const end = +new Date();
  const ms = end - timer;
  setTimeout(() => {
    ch.background(`Browser assets have finished building (${ms}ms).`);
    ch.header(
      `Browser assets available at: ${environment.devUrl}/webpack-dev-server`
    );
  }, 250);
});

compiler.hooks.compile.tap("ManifoldWebpackDevServer", params => {
  timer = +new Date();
  ch.background("Serving browser assets from webpack-dev-server.");
});

const hot = !process.env.DISABLE_HMR;
const allowedHosts = ["manifold.lvh", "localhost", "127.0.0.1", "manifold-dev.lvh", "manifold-stable.lvh", "manifold-dev.ngrok.io"];
if (process.env.DOMAIN) allowedHosts.push(process.env.DOMAIN);

const serverOptions = {
  hot,
  allowedHosts,
  quiet: false,
  noInfo: false,
  inline: false,
  lazy: false,
  headers: { "Access-Control-Allow-Origin": "*" },
  sockHost: process.env.DOMAIN || "localhost",
  sockPort: environment.devPort,
  stats: {
    modules: false,
    colors: true
  }
};

const server = new WebpackDevServer(compiler, serverOptions);
server.listen(environment.devPort);
