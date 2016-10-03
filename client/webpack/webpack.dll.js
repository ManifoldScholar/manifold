var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    vendor: [path.join(__dirname, "..", "src", "vendors.js")]
  },
  output: {
    path: path.join(__dirname, "..", "dist", "build", "universal", "dll"),
    filename: "dll.[name].js",
    library: "[name]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "..", "dist", "build", "universal", "dll", "[name]-manifest.json"),
      name: "[name]",
      context: path.resolve(__dirname, "..", "src")
    }),
    new webpack.optimize.OccurenceOrderPlugin()
    // ,new webpack.optimize.UglifyJsPlugin()
  ],
  resolve: {
    root: path.resolve(__dirname, "..", "src"),
    modulesDirectories: ["node_modules"]
  }
};
