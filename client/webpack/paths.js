const path = require("path");

const root = path.resolve(__dirname, "..");

module.exports = {
  root: root,
  static: path.resolve(root, "./static"),
  scripts: path.resolve(root, "./script"),
  servers: path.resolve(root, "./script/servers"),
  relativeOutput: "dist",
  src: path.resolve(root, "./src"),
  theme: path.resolve(root, "./src/theme"),
  env: path.resolve(root, "../.env")
};
