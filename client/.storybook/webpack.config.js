const webpack = require("webpack");
const DefinePlugin = webpack.DefinePlugin;
const path = require("path");

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.css$/,
    loaders: ["style-loader", "css-loader"],
    include: path.resolve(__dirname, "../")
  });

  config.module.rules.push({
    test: /\.font.js/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: "importLoaders=2"
      },
      {
        loader: path.resolve(
          __dirname,
          "../",
          "webpack/loaders/icon-font-loader"
        ),
        options: {
          fileName: `build/assets/[name][ext]`
        }
      }
    ]
  });

  config.module.rules.push(
    // The following rule monkey patches an Emotion warning. The Manifold client uses Emotion's
    // "advanced" approach to SSR, which means that the styles are inserted in the
    // head, rather than before each component. Therefore, the first-child warning
    // doesn't apply to our case. Sadly, emotion doesn't provide a viable way to
    // disable this warning, so we're doing what we did in the client and
    // monkey patching it in Storybook to stop it from spamming the console.
    // See https://github.com/emotion-js/emotion/issues/1105
    {
      test: /node_modules\/@emotion\/cache\/(src|dist)/,
      loader: "string-replace-loader",
      options: {
        search: "if (unsafePseudoClasses",
        replace: "if (false && unsafePseudoClasses"
      }
    }
  );

  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    new DefinePlugin({
      __BROWSER__: true,
      __SERVER__: false
    })
  );

  const pluginNoOp = path.resolve(
    __dirname,
    "../",
    "src/utils/plugins/missingPluginsManifest.js"
  );

  // console.log(config.resolve);
  config.resolve.modules = [
    path.resolve(__dirname, "../", "src"),
    "node_modules"
  ];
  config.resolve.alias.plugins$ = pluginNoOp;

  // Return the altered config
  return config;
};
