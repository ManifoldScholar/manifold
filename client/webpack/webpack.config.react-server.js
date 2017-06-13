import { server_configuration } from 'universal-webpack'
import settings from './react-server-webpack-settings'
import configuration from './webpack.config'
import webpack from 'webpack';

const config = server_configuration(configuration, settings);

// The universal-webpack plugin that we're using automatically collapses chunks into a
// single file. In Manifold, we're currently only splitting code into chunks if it can be
// loaded asynchronously, which means that it's only client-side code. For this reason,
// chunks should not be included in the server-side bundle. This line removes the
// LimitChunkCountPlugin, which is set by universal-webpack to have 1 maxChunk.
// We'll likely want to revisit this hack when we upgrade Webpack to v2.
config.plugins = config.plugins.filter((plugin) => {
  return plugin.constructor !== webpack.optimize.LimitChunkCountPlugin;
});

config.node = {
  __dirname: false,
  __filename: false
}

export default config
