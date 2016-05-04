var webpack = require('webpack');
var config = require('../src/config');
var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);
var WebpackDevServer = require('webpack-dev-server');
var serverOptions = {
  contentBase: 'http://manifold.dev:' + config.assetPort,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};
var server = new WebpackDevServer(compiler, serverOptions);
server.listen(config.assetPort);
