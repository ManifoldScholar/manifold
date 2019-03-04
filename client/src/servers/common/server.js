import fs from "fs";
import ch from "../../helpers/consoleHelpers";
import PrettyError from "pretty-error";
import http from "http";
import httpShutdown from "http-shutdown";

export default function webServer(
  app,
  name,
  options = { socket: null, port: null }
) {
  const pretty = new PrettyError();
  const socket = options.socket;
  const port = options.port;
  const servers = [];

  // Helpers
  const unlinkSocket = () => {
    if (!socket) return;
    if (!fs.existsSync(socket)) return;
    fs.unlinkSync(socket);
    ch.error(`${name} server is unlinking the existing socket at ${socket}.`);
  };

  const shutdown = signal => {
    ch.error(`${name} server received ${signal} signal.`);
    ch.error(`${name} server is shuting down.`);
    servers.forEach(server => {
      server.close(() => {
        unlinkSocket();
      });
    });
    process.kill(process.pid, signal);
  };

  const makeListenCallback = (listen, listenType) => {
    return err => {
      if (err) {
        ch.error(`${name} server encountered an error.`);
        ch.error("SERVER ERROR:", pretty.render(err));
      }

      if (listenType === "socket") {
        ch.header(`${name} server is listening on a socket at ${listen}.`);
        return fs.chmodSync(socket, "0777");
      }
      if (listenType === "port") {
        ch.header(`${name} server is listening on port ${listen}.`);
      }
    };
  };

  if (port) {
    const server = httpShutdown(new http.Server(app));
    server.listen(port, makeListenCallback(port, "port"));
    servers.push(server);
  }

  if (socket) {
    unlinkSocket();
    const server = httpShutdown(new http.Server(app));
    server.listen(socket, makeListenCallback(socket, "socket"));
    servers.push(server);
  }

  // Handle process exiting.
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGUSR1", () => shutdown("SIGUSR1"));
  process.once("SIGUSR2", () => shutdown("SIGUSR2"));
}
