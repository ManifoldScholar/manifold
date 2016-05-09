require("babel-polyfill");
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var strip = require('strip-loader');
var autoprefixer = require('autoprefixer');
var relativeAssetsPath = '../static/dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};
var CleanWebpackPlugin = require('clean-webpack-plugin');

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectProduction = babelrcObject.env && babelrcObject.env.production || {};
var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectProduction);
delete babelLoaderQuery.env;

module.exports = {
  devtool: 'cheap-module-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      './src/client.js'
    ]
    ,
    'theme': [
      './src/theme/theme.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/'
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
        exclude: function(path) {
          // We're using QS in the browser, and it has es2015 constructs like "const"
          if (path.match(/node_modules\/qs/)) return false;
          if (path.match(/node_modules/)) return true;
        },
        loaders: [strip.loader('debug'), 'babel?' + JSON.stringify(babelLoaderQuery)],
      },
      {
        test: /\.json$/,
        loaders: ['json-loader']
      },
      { test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style',
          'css?importLoaders=2&sourceMap!postcss?syntax=postcss-scss!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
        )
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=10240'
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
  plugins: [

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('[name]-[chunkhash].css', {allChunks: true}),
    new webpack.DefinePlugin({
      __MANIFOLD_API_URL__: '"' +  process.env.MANIFOLD_API_URL + '"',
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production')
      }
    }),

    new CleanWebpackPlugin(['static/dist'], {
      root: path.join(__dirname, '../'),
      verbose: true,
      dry: false
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
     new webpack.optimize.UglifyJsPlugin({
       compress: {
           warnings: false,
           dead_code: true
         }
     }),

    webpackIsomorphicToolsPlugin
  ],
  postcss: function() {
    return [ autoprefixer({ browsers: ['last 2 versions'] }) ];
  }
};
