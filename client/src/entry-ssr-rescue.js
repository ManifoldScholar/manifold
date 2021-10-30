import config from "config";
import React from "react";
import ReactDOM from "react-dom/server";
import HtmlBody from "./helpers/HtmlBody";
import wrapHtmlBody from "./helpers/wrapHtmlBody";
import makeRendererProxy from "./servers/proxies/renderer";
import webServer from "./servers/common/server";
import webApp from "./servers/common/app";
import readStats from "./servers/common/read-stats";

const port = config.services.client.port;
const socket = config.services.client.socket;

// Handle requests
const requestHandler = (req, res) => {
  const stats = readStats("Development");
  let render;
  try {
    render = ReactDOM.renderToString(<HtmlBody stats={stats} />);
  } catch (err) {
    console.log(err, "err"); // eslint-disable-line no-console
  }
  const htmlOutput = wrapHtmlBody({
    stats,
    body: render
  });
  res.setHeader("Content-Type", "text/html");
  res.end(htmlOutput);
};

// Create the app and the server
const app = webApp("SSR Rescue", {
  proxyDevAssets: true,
  proxyAPI: config.services.client.proxiesEnabled
});

if (!config.environment.skipSSR)
  app.use("/", makeRendererProxy(requestHandler));
app.use(requestHandler);

webServer(app, "SSR Rescue", { port, socket });
