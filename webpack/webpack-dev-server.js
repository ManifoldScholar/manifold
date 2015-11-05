var Express = require('express');
var webpack = require('webpack');
var colors = require('colors');
var config = require('../src/config');
var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = process.env.HOST || 'localhost';
var port = parseInt(config.port, 10) + 1 || 3001;

var emoji = require('node-emoji').emoji;

var serverOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  headers: {'Access-Control-Allow-Origin': '*'},
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('');
    console.log('--------------------------------------------------------------------------------'.bold);
    console.log('%s  MANIFOLD ASSET SERVER'.white.bold, emoji.construction);
    console.log('--------------------------------------------------------------------------------'.bold);
    console.log('Manifold Asset Server, a.k.a. Webpack, is listening at http://127.0.0.1:%s'.green, port);
    console.log('');
  }
});
