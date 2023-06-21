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

const hot = process.env.DISABLE_HMR ? false : "only";

console.log(hot,"ZDHOT");

const allowedHosts = ["manifold.lvh", "localhost", "127.0.0.1", "manifold-dev.lvh", "dev-manifold.lvh", "manifold-stable.lvh", "manifold-dev.ngrok.io"];
if (process.env.DOMAIN) allowedHosts.push(process.env.DOMAIN);

const serverOptions = {
  hot,
  allowedHosts,
  headers: { "Access-Control-Allow-Origin": "*" },
  client: {
    webSocketURL: {
      hostname: process.env.DOMAIN || "localhost",
      port: environment.devPort,
    },
  },
  devMiddleware: {
    stats: {
      modules: false,
      colors: true
    }
  }
};

const server = new WebpackDevServer(compiler, serverOptions);
server.listen(environment.devPort);
