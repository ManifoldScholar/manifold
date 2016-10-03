require("babel-polyfill");
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var assetsPath = path.resolve(__dirname, '../dist/build/client');
var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

// TODO: Handle babelrc env switching
var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};
var babelLoaderQuery = Object.assign({}, babelrcObject, babelrcObjectDevelopment);
delete babelLoaderQuery.env;
Object.assign(babelLoaderQuery, {cacheDirectory: true});

module.exports = {
  devtool: "eval",
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
      'webpack-dev-server/client?http://0.0.0.0:3001',
      'webpack/hot/only-dev-server',
      './src/theme/theme.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/build/client/'
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
        loader: 'babel',
        include: path.resolve('./src'),
        query: babelLoaderQuery
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
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "..", "src"),
      manifest: require("../dist/build/universal/dll/vendor-manifest.json")
    }),
    new webpack.DefinePlugin({
      __MANIFOLD_API_URL__: '"' +  global.__MANIFOLD_API_URL__ + '"',
      __CLIENT__: global.__CLIENT__,
      __SERVER__: global.__SERVER__,
      __DEVELOPMENT__: global.__DEVELOPMENT__,
      __DEVTOOLS__: global.__DEVELOPMENT__
    })
  ],
  postcss: function() {
    return [ autoprefixer({ browsers: ['last 2 versions'] }) ];
  }
};
