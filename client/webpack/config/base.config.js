import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CircularDependencyPlugin from "circular-dependency-plugin";
import environment from "../helpers/environment";
import plugins from "../helpers/plugins";
import paths from "../helpers/paths";

const nameTemplate = environment.production ? "[name]-[hash]" : "[name]";

const postcssFocusVisible = require("postcss-focus-visible");

/* eslint-disable  global-require */
export default function buildWebpackConfiguration(target = "web") {
  function styleLoader() {
    if (target !== "web") return null;
    if (environment.isBuild) return MiniCssExtractPlugin.loader;
    return "style-loader";
  }

  const webpackConfiguration = {
    mode: environment.name,
    context: paths.root,

    output: {
      chunkFilename: `build/chunk-${nameTemplate}.js`,
      path: paths.build,
      publicPath: "/",
      filename: `${nameTemplate}.js`
    },

    target,

    devtool: "source-map",

    module: {
      rules: [
        // Javascript loader
        {
          test: /\.js$/,
          include: [paths.src, paths.plugins],
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true
              }
            }
          ]
        },

        // SASS loader: sass > postcss > css > style or css extract into separate file.
        {
          test: /\.(s?)css$/,
          include: [paths.src, paths.plugins],
          use: [
            styleLoader(),
            {
              loader: "css-loader",
              options: "importLoaders=2"
            },
            {
              loader: "postcss-loader",
              options: {
                syntax: "postcss-scss",
                plugins: () => [
                  require("autoprefixer"),
                  postcssFocusVisible({
                    // don't preserve `:focus-visible` selector until wider browser support exists
                    // https://github.com/jonathantneal/postcss-focus-visible/issues/6
                    preserve: false
                  })
                ]
              }
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  outputStyle: "expanded"
                }
              }
            }
          ].filter(loader => loader !== null)
        },

        // url-loader includes small file in the bundle, inline, and passes large files to
        // file-loader
        {
          test: /\.(woff|woff2|ttf|eot|svg|gif|jpg|jpeg|png)$/i,
          include: [paths.src, paths.plugins],
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 15000, // inline files 15k or less
                name: `build/assets/${nameTemplate}.[ext]`,
                fallback: "file-loader"
              }
            }
          ]
        }
      ]
    },

    watchOptions: {
      ignored: /node_modules/
    },

    stats: {
      modules: false,
      colors: true
    },

    resolve: {
      modules: [paths.src, "node_modules"],
      alias: plugins.webpackAliases
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: `${nameTemplate}.css`,
        chunkFilename: `chunk-${nameTemplate}.css`
      }),

      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules|src\/global\/containers\/comment\/|src\/global\/components\/comment\//,
        failOnError: true,
        cwd: paths.root
      })
    ]
  };
  return webpackConfiguration;
}

/* eslint-enable global-require */
