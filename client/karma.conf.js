var webpack = require('webpack');
var fs = require('fs');
var path = require('path');

module.exports = function (config) {

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

  config.set({
    basePath: '',
    frameworks: [ 'mocha' ],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './node_modules/babel-polyfill/dist/polyfill.js',
      'tests.webpack.js'
    ],
    browsers: ['PhantomJS'],
    singleRun: false,
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha' ],
    plugins: [
      require("karma-webpack"),
      require("karma-mocha"),
      require("karma-mocha-reporter"),
      require("karma-phantomjs-launcher"),
      require("karma-sourcemap-loader")
    ],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/,
            loaders: ['babel?' + JSON.stringify(babelLoaderQuery)],
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
          }
        ]
      },
      resolve: {
        modulesDirectories: [
          'src',
          'node_modules'
        ],
        extensions: ['', '.json', '.js']
      },
      externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      },
      plugins: [
        new webpack.IgnorePlugin(/\.json$/),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
        })
      ]
    },
    webpackServer: {
      noInfo: true
    }

  });
};
