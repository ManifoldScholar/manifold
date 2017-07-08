const webpack = require("webpack");
const paths = require("./paths");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

// No hashes in names when we're in development, to simplify finding assets.
const nameTemplate =
  process.env.NODE_ENV === "development" ? "[name]" : "[name]-[hash]";
const fontnameTemplate =
  process.env.NODE_ENV === "development" ? "[fontname]" : "[fontname]-[hash]";

module.exports = (options = {}) => {
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
    use: [
      { loader: "style-loader" },
      { loader: "css-loader", options: "importLoaders=2" },
      { loader: "postcss-loader", options: "syntax=postcss-scss" },
      { loader: "sass-loader", options: "outputStyle=expanded" }
    ],
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
  // PLUGINS
  // #####################################################################################
  let plugins = [];

  const extractText = new ExtractTextPlugin("[name].css");
  plugins.push(extractText);

  // if (process.env.NODE_ENV === "development") {
  //   plugins.push(new BundleAnalyzerPlugin());
  // }

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
