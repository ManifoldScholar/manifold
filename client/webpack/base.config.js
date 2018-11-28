const webpack = require("webpack");
const paths = require("./paths");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CircularDependencyPlugin = require('circular-dependency-plugin');

const isDev = process.env.NODE_ENV === "development";
const mode = isDev ? "development" : "production";

// No hashes in names when we're in development, to simplify finding assets.
const nameTemplate = isDev ? "[name]" : "[name]-[hash]";
const fontnameTemplate = isDev ? "[fontname]" : "[fontname]-[hash]";

module.exports = (options = {}) => {
  // #####################################################################################
  // PLUGINS
  // #####################################################################################
  let plugins = [];

  const extractText = new ExtractTextPlugin({
    filename: "[name].css",
    disable: isDev
  });
  plugins.push(extractText);

  const circularDependency = new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // set the current working directory for displaying module paths
    cwd: process.cwd(),
  });
  plugins.push(circularDependency);

  // #####################################################################################
  // RULES
  // #####################################################################################
  const rules = [];

  const ruleIconFont = {
    test: /\.font.js/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      {
        loader: "fontgen",
        options: {
          fileName: `build/assets/${fontnameTemplate}[ext]`
        }
      }
    ],
    include: paths.theme
  };

  const ruleJavascript = {
    test: /\.js$/,
    include: paths.src,
    use: [
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: true
        }
      }
    ]
  };

  const ruleSass = {
    test: /\.scss$/,
    use: extractText.extract({
      use: [
        { loader: "css-loader", options: "importLoaders=2" },
        {
          loader: "postcss-loader",
          options: {
            syntax: "postcss-scss",
            plugins: () => [require("autoprefixer")]
          }
        },
        { loader: "sass-loader", options: "outputStyle=expanded" }
      ],
      fallback: "style-loader"
    }),
    include: paths.theme
  };

  const generateUrlRule = (ext, mimetype, limit = 10000) => {
    return {
      test: new RegExp(`\\.${ext}(\\?v=\\d+\\.\d+\\.\\d+)?$`),
      use: [
        {
          loader: "url-loader",
          options: {
            limit,
            mimetype,
            name: `build/assets/${nameTemplate}.[ext]`
          }
        }
      ],
      include: paths.src
    };
  };

  // rules.push(ruleEnv);
  rules.push(ruleIconFont);
  rules.push(ruleJavascript);
  rules.push(ruleSass);
  rules.push(generateUrlRule("woff", "application/font-woff"));
  rules.push(generateUrlRule("woff2", "application/font-woff"));
  rules.push(generateUrlRule("ttf", "application/octet-stream"));
  rules.push(generateUrlRule("eot", "application/vnd.ms-fontobject"));
  rules.push(generateUrlRule("svg", "image/svg+xml"));

  // #####################################################################################
  // HANDLE OPTIONS
  // #####################################################################################
  if (options.plugins) {
    plugins = plugins.concat(options.plugins);
  }

  // #####################################################################################
  // OUTPUT
  // #####################################################################################
  return {
    mode: mode,
    context: paths.root,
    module: { rules },
    watchOptions: {
      ignored: /node_modules/
    },
    resolveLoader: {
      alias: {
        fontgen: path.join(__dirname, "./loaders/fontgen")
      }
    },
    resolve: {
      modules: [paths.src, "node_modules"]
    },
    stats: {
      modules: false,
      colors: true
    },
    plugins
  };
};
