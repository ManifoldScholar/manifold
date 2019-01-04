import config from "config";
import React from "react";
import ReactDOM from "react-dom/server";
import Html from "./helpers/Html";
import makeRendererProxy from "./servers/proxies/renderer";
import webServer from "./servers/common/server";
import webApp from "./servers/common/app";
import readStats from "./servers/common/read-stats";

const port = config.services.client.port;
const socket = config.services.client.socket;
const stats = readStats("Development");

// Handle requests
const requestHandler = (req, res) => {
  let render;
  try {
    render =
      "<!doctype html>\n" + ReactDOM.renderToString(<Html stats={stats} />);
  } catch (err) {
    console.log(err, "err"); // eslint-disable-line no-console
  }
  res.setHeader("Content-Type", "text/html");
  res.end(render);
};

// Create the app and the server
const app = webApp("SSR Rescue", {
  proxyDevAssets: true,
  proxyAPI: config.services.client.proxiesEnabled
});

app.use("/", makeRendererProxy(stats, requestHandler));
app.use(requestHandler);

webServer(app, "SSR Rescue", { port, socket });
