import config from "./config";
import ch from "./helpers/consoleHelpers";
import React from "react";
import ReactDOM from "react-dom/server";
import Html from "./helpers/Html";
import makeRendererProxy from "./servers/proxies/renderer";
import webServer from "./servers/common/server";
import webApp from "./servers/common/app";
import readStats from "./servers/common/readStats";

const socket = config.clientSocket;
const port = config.clientPort;
const clientFallbackPort = `http://localhost:${config.clientFallbackPort}`;
const stats = readStats("Development");

// Handle requests
const requestHandler = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end(
    "<!doctype html>\n" + ReactDOM.renderToString(<Html stats={stats} />)
  );
};

// Create the app and the server
const app = webApp("development");
ch.info(
  `Development server will proxy all other requests to the client service at ${clientFallbackPort}`
);
if (process.env.WEBPACK_DEV_SERVER)
  app.use("/", makeRendererProxy(stats, requestHandler));
app.use(requestHandler);
webServer(app, "development", { socket, port });
