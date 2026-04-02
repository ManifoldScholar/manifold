import fs from "fs";
import path from "path";
import config from "config";
import ch from "../../helpers/consoleHelpers";

let cachedStats = null;

export default function readStats(name) {
  if (cachedStats && config.environment.isProduction) return cachedStats;

  const statsPath = path.join(__dirname, "..", "manifest.json");

  try {
    const data = fs.readFileSync(statsPath, "utf8");
    cachedStats = JSON.parse(data);
    return cachedStats;
  } catch (err) {
    [
      `Manifold's Node ${name} server is starting without a client asset manifest,`,
      "which should be at manifest/client.json. Without a manifest, the server",
      "isn't able to serve the client javascript/css bundles. Has the client",
      "been built? Running 'yarn build' will regenerate servers and client,",
      "including a new client manifest."
    ].forEach(msg => ch.error(msg));
    console.log(err, "err"); // eslint-disable-line no-console
    process.exit();
  }
}
