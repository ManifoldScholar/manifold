import endsWith from "lodash/endsWith";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import isArray from "lodash/isArray";

export default function reduceAssets(ext, stats) {
  if (!stats?.assetsByChunkName) return [];
  const test = asset => {
    return endsWith(asset, ext);
  };

  const chunks = stats.assetsByChunkName;
  return reduce(
    chunks,
    (entries, assets, chunkName) => {
      if (
        ![
          "build/manifold-client-browser",
          "build/manifold-client-print"
        ].includes(chunkName)
      )
        return entries;
      if (isString(assets) && test(assets)) entries.push(assets);
      if (isArray(assets)) {
        assets.forEach(asset => {
          if (test(asset)) entries.push(asset);
        });
      }
      return entries;
    },
    []
  );
}
