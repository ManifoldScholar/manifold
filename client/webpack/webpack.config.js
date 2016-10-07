require("babel-polyfill");

var CopyWebpackPlugin = require('copy-webpack-plugin');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var assetsPath = path.resolve(__dirname, '../dist/build/client/build/');
var babelrc = fs.readFileSync('./.babelrc');

// Grab the babelrc config.
try {
  var babelrcTotal = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

// Select the correct babel environment to build the loader query.
var environment = __ENVIRONMENT__;
var babelRcEnv= babelrcTotal.env && babelrcTotal.env[environment]|| {};
var babelLoaderQuery = Object.assign({}, babelrcTotal, babelRcEnv);
delete babelLoaderQuery.env;
Object.assign(babelLoaderQuery, {cacheDirectory: true});


// Create the entries. If we're in dev, we want hot loading
var mainEntry = ['./src/client.js'];
var themeEntry = ['./src/theme/theme.js'];
if (__DEVELOPMENT__) {
  mainEntry.unshift('webpack/hot/only-dev-server');
  mainEntry.unshift('webpack-dev-server/client?http://0.0.0.0:3001');
  mainEntry.unshift('react-hot-loader/patch');
  themeEntry.unshift('webpack/hot/only-dev-server');
  themeEntry.unshift('webpack-dev-server/client?http://0.0.0.0:3001');
  themeEntry.unshift('react-hot-loader/patch');
}

// Determine the public path
var publicPath;
if (__DEVELOPMENT__) {
  publicPath = '/build/client/build/';
} else {
  publicPath = '/';
}

// Set the plugins.
var plugins;
if (__DEVELOPMENT__) {
  plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "..", "src"),
      manifest: require("../dist/build/universal/dll/vendor-manifest.json")
    })
  ];
} else {
  plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, "..", "static"),
      to: "static"
    }]),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
        dead_code: true
      }
    })
  ];
}

if (__CLIENT__ && __PRODUCTION__) {
  plugins.push(new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }));
}

// Push those globals, yo.
plugins.push(new webpack.DefinePlugin({
    __MANIFOLD_API_URL__: '"' +  global.__MANIFOLD_API_URL__ + '"',
    __CLIENT__: global.__CLIENT__,
    __SERVER__: global.__SERVER__,
    __DEVELOPMENT__: global.__DEVELOPMENT__,
    __DEVTOOLS__: global.__DEVELOPMENT__
  })
);

let devtool;
if (__DEVELOPMENT__) {
  devtool = "cheap-module-eval-source-map";
} else {
  devtool = "cheap-module-source-map";
}

module.exports = {
  devtool: devtool,
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': mainEntry
    ,
    'theme': themeEntry
  },
  output: {
    path: assetsPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: publicPath
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
  plugins: plugins,
  postcss: function() {
    return [ autoprefixer({ browsers: ['last 2 versions'] }) ];
  }
};
