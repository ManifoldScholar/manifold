const webpack = require("webpack");
const DefinePlugin = webpack.DefinePlugin;
const path = require("path");
const postcssFocusVisible = require("postcss-focus-visible");
const postcssCustomProperties = require("postcss-custom-properties");

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
  // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  config.module.rules.push({
    test: /\.scss$/,
    loaders: [
      "style-loader",
      "css-loader",
      {
        loader: "postcss-loader",
        options: {
          syntax: "postcss-scss",
          plugins: () => [
            require("autoprefixer"),
            postcssFocusVisible({
              preserve: false
            }),
            postcssCustomProperties()
          ]
        }
      },
      "sass-loader"
    ],
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

  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    new DefinePlugin({
      __BROWSER__: true,
      __SERVER__: false
    })
  );

  const sassNoOp = path.resolve(
    __dirname,
    "../",
    "src/utils/plugins/null.scss"
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
  config.resolve.alias = {
    ...config.resolve.alias,
    userVariables$: sassNoOp,
    userStyles$: sassNoOp,
    plugins$: pluginNoOp,
    "hooks/use-current-user": path.resolve(
      __dirname,
      "./__mocks__/useCurrentUser"
    )
  };

  // Return the altered config
  return config;
};
