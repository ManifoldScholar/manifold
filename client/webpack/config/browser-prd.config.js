import baseConfig from "./browser-base.config";
import merge from "webpack-merge";
import CopyWebpackPlugin from "copy-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import paths from "../helpers/paths";

const config = merge(baseConfig, {
  plugins: [
    new CopyWebpackPlugin({
      // Unless we're running the webpack dev server, we need to copy static assets into
      // the build.
      patterns: [
        {
          from: "static",
          to: `${paths.build}/www/static`,
          transform: {
            cache: true
          }
        }
      ]
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              convertValues: false
            }
          ]
        }
      }),
      new TerserPlugin({ terserOptions: { sourceMap: true } })
    ]
  }
});

export default config;
