import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CircularDependencyPlugin from "circular-dependency-plugin";
import environment from "../helpers/environment";
import plugins from "../helpers/plugins";
import paths from "../helpers/paths";

const nameTemplate = environment.production ? "[name]-[contenthash]" : "[name]";

/* eslint-disable global-require */
export default function buildWebpackConfiguration(
  target = ["web", "browserslist"]
) {
  function styleLoader() {
    if (!target.includes("web")) return null;
    if (environment.isBuild) return MiniCssExtractPlugin.loader;
    return "style-loader";
  }

  const webpackConfiguration = {
    mode: environment.name,
    context: paths.root,
    bail: environment.production,

    output: {
      chunkFilename: `build/chunk-${nameTemplate}.js`,
      path: paths.build,
      pathinfo: environment.development,
      publicPath: "/",
      filename: `${nameTemplate}.js`
    },

    target,

    devtool: environment.production ? "source-map" : "eval-cheap-source-map",

    module: {
      rules: [
        // The following rule monkey patches an Emotion warning. We're using Emotion's
        // "advanced" approach to SSR, which means that the styles are inserted in the
        // head, rather than before each component. Therefore, the first-child warning
        // doesn't apply to our case. Sadly, emotion doesn't provide a viable way to
        // disable this warning, so we're monkey patching it here to stop it from spamming
        // the console. See https://github.com/emotion-js/emotion/issues/1105
        {
          test: /node_modules\/@emotion\/cache\/(src|dist)/,
          loader: "string-replace-loader",
          options: {
            search: "if (unsafePseudoClasses",
            replace: "if (false && unsafePseudoClasses"
          }
        },
        // Javascript loader
        {
          test: /\.m?js$/,
          include: [paths.src, paths.plugins],
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory: true,
                compact: environment.production
              }
            }
          ]
        },

        // CSS loader: css > style or css extract into separate file.
        {
          test: /\.css$/,
          include: [paths.src, paths.plugins],
          use: [
            styleLoader(),
            {
              loader: "css-loader",
              options: {
                importLoaders: 2
              }
            }
          ].filter(loader => loader !== null)
        },

        {
          type: "asset",
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          include: [paths.src, paths.plugins],
          generator: {
            filename: `build/assets/${nameTemplate}.[ext]`
          },
          parser: {
            dataUrlCondition: {
              maxSize: 15000
            }
          }
        },

        {
          type: "asset/resource",
          test: [/\.woff2?$/, /\.ttf$/, /\.eot$/],
          generator: {
            filename: `build/assets/${nameTemplate}[ext]`
          },
          parser: {
            dataUrlCondition: {
              maxSize: 15000
            }
          }
        },

        // https://github.com/securingsincity/react-ace/issues/725#issuecomment-1288926325
        {
          test: [/ace-builds.*\/worker-.*$/, /ace-builds.*\/theme-.*$/],
          type: "asset/resource",
          generator: {
            filename: `build/${nameTemplate}[ext]`
          }
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
      environment.isBuild &&
        new MiniCssExtractPlugin({
          filename: `${nameTemplate}.css`,
          chunkFilename: `chunk-${nameTemplate}.css`
        }),

      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules|src\/global\/containers\/comment\/|src\/global\/components\/comment\//,
        failOnError: true,
        cwd: paths.root
      })
    ].filter(Boolean)
  };
  return webpackConfiguration;
}
/* eslint-enable global-require */
