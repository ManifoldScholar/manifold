const presets = [
  [
    "@babel/preset-react",
    {
      runtime: "automatic"
    }
  ],
  [
    "@babel/preset-env",
    {
      useBuiltIns: "entry",
      corejs: "3.44"
    }
  ]
];
const plugins = [
  "@emotion",
  ["@babel/plugin-proposal-decorators", { version: "2023-11" }],
  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-proposal-function-sent",
  "@babel/plugin-proposal-throw-expressions",
  [
    "module-resolver",
    {
      root: ["./src"]
    }
  ]
];

// We'd prefer to export a function, per babel 7 docs, but as far as we can tell,
// Jest does not support an function exported from babel.config.js, so we need to
// export a hash.
module.exports = {
  presets,
  plugins
};
