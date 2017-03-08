import webpack from 'webpack';
import appConfig from '../src/config';
import webpackConfig from './webpack.config.client';
import WebpackDevServer from 'webpack-dev-server';
import ch from '../src/helpers/consoleHelpers';

const compiler = webpack(webpackConfig);
let timer;

compiler.plugin('done', (stats) => {
  const end = +new Date();
  const ms = end - timer;
  ch.header(`Client-side assets have finished building (${ms}ms)`);
});

compiler.plugin('compile', (params) => {
  timer = +new Date();
  ch.info('Client-side assets are being built');
});


const serverOptions = {
  contentBase: ['dist'],
  quiet: true,
  noInfo: false,
  hot: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

const server = new WebpackDevServer(compiler, serverOptions);
server.listen(appConfig.assetPort);
