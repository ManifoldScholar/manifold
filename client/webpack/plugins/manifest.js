const paths = require("../paths");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

function statsPlugin(options) {
  this.options = options;
}

statsPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin("after-emit", (compilation, done) => {
    const stats = compilation.getStats().toJson({
      hash: true,
      version: true,
      timings: false,
      assets: true,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false,
      cached: false,
      reasons: false,
      children: false,
      source: false,
      errors: false,
      errorDetails: false,
      warnings: false,
      publicPath: true
    });
    delete stats.assets;
    const out = { assetsByChunkName: stats.assetsByChunkName };
    const targetDir = process.env.WEBPACK_BUILD_TARGET
      ? process.env.WEBPACK_BUILD_TARGET
      : "";
    const base = path.resolve(paths.root, targetDir, paths.relativeOutput);
    const writePath = `${base}/${this.options.fileName}`;
    mkdirp.sync(base);
    fs.writeFile(writePath, JSON.stringify(out, null, 2), done);
  });
};

module.exports = statsPlugin;
