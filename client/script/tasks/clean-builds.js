import rimraf from 'rimraf';
import path from 'path';

const buildPaths = [
  path.join(__dirname, "..", "..", "dist", "build", "server", "react-server", "*"),
  path.join(__dirname, "..", "..", "dist", "build", "server", "web-server", "*"),
  path.join(__dirname, "..", "..", "dist", "build", "client", "**")
]

buildPaths.forEach((path) => {
  rimraf.sync(path);
})

