import fs from "fs";
import ch from "../../helpers/consoleHelpers";
import PrettyError from "pretty-error";
import http from "http";
import capitalize from "lodash/capitalize";

export default function webServer(app, name, options) {
  const pretty = new PrettyError();
  const socket = options.socket;
  const port = options.port;
  const listen = socket || port;
  const listenType = socket ? "socket" : "port";

  // Helpers
  const unlinkSocket = () => {
    if (!socket) return;
    if (!fs.existsSync(socket)) return;
    fs.unlinkSync(socket);
    ch.error(
      capitalize(
        `${name} server is unlinking the existing socket at ${socket}.`
      )
    );
  };

  // Callbacks
  const onServerListen = err => {
    if (err) {
      ch.error(capitalize(`${name} server encountered an error.`));
      ch.error("SERVER ERROR:", pretty.render(err));
    }
    if (listenType === "socket") {
      ch.header(
        capitalize(`${name} server is listening on a socket at ${listen}.`)
      );
    } else {
      ch.header(capitalize(`${name} server is listening on port ${listen}.`));
    }
  };

  const onServerError = error => {
    if (error.code === "EADDRINUSE" && socket) {
      ch.error(
        capitalize(capitalize(`${name} server can't bind to existing socket.`))
      );
      unlinkSocket();
    } else {
      ch.error(error);
    }
  };

  const shutdown = (server, signal) => {
    server.close(() => {
      ch.error(`${capitalize(name)} server received ${signal} signal.`);
      unlinkSocket();
      ch.error(capitalize(`${capitalize(name)} server is shuting down.`));
      process.kill(process.pid, signal);
    });
  };

  const start = server => {
    server.listen(listen, onServerListen);
  };

  // Initialize the server and start it.
  const server = new http.Server(app);
  server.on("error", onServerError);
  ch.info(capitalize(`${name} server is starting up.`));
  start(server);

  // Handle process exiting.
  process.once("SIGTERM", () => shutdown(server, "SIGTERM"));
  process.once("SIGINT", () => shutdown(server, "SIGINT"));
  process.once("SIGUSR1", () => shutdown(server, "SIGUSR1"));
  process.once("SIGUSR2", () => shutdown(server, "SIGUSR2"));
  return server;
}
