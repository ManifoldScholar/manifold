import webpack from 'webpack';
import appConfig from '../src/config';
import webpackConfig from './webpack.config.client';
import WebpackDevServer from 'webpack-dev-server';
import ch from '../src/helpers/consoleHelpers';

const compiler = webpack(webpackConfig);

compiler.plugin('done', (stats) => {
  ch.header('Client-side assets have finished building');
});

compiler.plugin('compile', (params) => {
  ch.info('Client-side assets are being built');
});


const serverOptions = {
  contentBase: ['dist'],
  quiet: true,
  noInfo: false,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

const server = new WebpackDevServer(compiler, serverOptions);
server.listen(appConfig.assetPort);
