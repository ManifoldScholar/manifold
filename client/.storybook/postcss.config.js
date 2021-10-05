module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-focus-visible")({
      preserve: false
    }),
    require("postcss-custom-properties")
  ]
};
