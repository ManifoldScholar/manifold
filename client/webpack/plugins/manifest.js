import paths from "../helpers/paths";
import fs from "fs";
import mkdirp from "mkdirp";

function ManifestPlugin(options) {
  this.options = options;
}

ManifestPlugin.prototype.apply = function apply(compiler) {

  compiler.hooks.afterEmit.tap("ManifoldWebpackManifestPlugin", (compilation, done) => {
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
    const writePath = `${paths.build}/${this.options.fileName}`;
    mkdirp.sync(paths.build);
    fs.writeFileSync(writePath, JSON.stringify(out, null, 2), done);
  });
};

module.exports = ManifestPlugin;
