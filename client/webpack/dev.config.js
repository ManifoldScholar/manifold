require("babel-polyfill");
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var assetsPath = path.resolve(__dirname, '../static/dist');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};
var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectDevelopment);
delete babelLoaderQuery.env;

module.exports = {
  devtool: 'eval',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://0.0.0.0:3001',
      'webpack/hot/only-dev-server',
      './src/client.js'
    ]
    ,
    'theme': [
      './src/theme/theme.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://manifold.dev:3001/dist/'
  },
  resolveLoader: {
    alias: {
      "fontgen": path.join(__dirname, "./loaders/fontgen")
    }
  },
  module: {
    loaders: [
      {
        test: /\.font.js/,
        loaders: ['style', 'css', 'fontgen'],
        include: path.resolve('./src')
      },
      { test: /\.js$/,
        loaders: ['babel?' + JSON.stringify(babelLoaderQuery), 'eslint-loader'],
        include: path.resolve('./src')
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
        include: path.resolve('./src')
      },
      { test: /\.scss$/,
        loaders: [
          'style',
          'css?importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
          'postcss?syntax=postcss-scss',
          'sass?outputStyle=expanded&sourceMap'
        ],
        include: path.resolve('./src')
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff",
        include: path.resolve('./src')
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff",
        include: path.resolve('./src')
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream",
        include: path.resolve('./src')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file",
        include: path.resolve('./src')
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml",
        include: path.resolve('./src')
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=10240',
        include: path.resolve('./src')
      }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  node: {
    fs: "empty"
  },
  plugins: [
    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __MANIFOLD_API_URL__: '"' +  process.env.MANIFOLD_API_URL + '"',
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    }),
    webpackIsomorphicToolsPlugin.development()
  ],
  postcss: function() {
    return [ autoprefixer({ browsers: ['last 2 versions'] }) ];
  }
};
