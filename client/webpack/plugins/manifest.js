import paths from "../helpers/paths";
import fs from "fs";
import { mkdirp } from "mkdirp";

function filterOutHMRAssets(group) {
  return (
    group.assets
      // prevent HMR files from making it into manifest file
      // https://github.com/webpack/webpack/issues/11670
      .filter(asset => !/.*hot-update.*$/.test(asset.name))
      .map(asset => asset.name)
  );
}

function ManifestPlugin(options) {
  this.options = options;
}

ManifestPlugin.prototype.apply = function apply(compiler) {
  compiler.hooks.afterEmit.tap(
    "ManifoldWebpackManifestPlugin",
    (compilation, done) => {
      const stats = compilation.getStats().toJson({
        hash: true,
        version: true,
        timings: false,
        assets: true,
        chunks: true,
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
      mkdirp.sync(paths.build);

      /* @loadable/server needs the unmodified json, so write a copy first */
      const loadableStatsPath = `${paths.build}/loadable-stats.json`;
      fs.writeFileSync(loadableStatsPath, JSON.stringify(stats, null, 2), done);

      /* chunks only needed for @loadable/server */
      delete stats.chunks;
      delete stats.assets;

      const filteredGroups = {};
      for (const groupName in stats.namedChunkGroups) {
        filteredGroups[groupName] = filterOutHMRAssets(
          stats.namedChunkGroups[groupName]
        );
      }
      const out = {
        assetsByChunkName: filteredGroups
      };

      const writePath = `${paths.build}/${this.options.fileName}`;
      fs.writeFileSync(writePath, JSON.stringify(out, null, 2), done);
    }
  );
};

module.exports = ManifestPlugin;
