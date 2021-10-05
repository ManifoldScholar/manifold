const babelConfig = require("./babel.config.js");
const webpackConfig = require("./webpack.config.js");

module.exports = {
  stories: ["../src/**/*.stories.@(js|mdx)"],
  addons: [
    "@storybook/addon-knobs",
    "@storybook/addon-a11y",
    "@storybook/preset-scss",
    "@storybook/addon-postcss",
    "storybook-addon-jsx"
  ],
  webpackFinal: webpackConfig,
  babel: babelConfig
};
