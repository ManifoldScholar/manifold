const presets = [
  "@babel/preset-react",
  [
    "@babel/preset-env",
    {
      useBuiltIns: "entry",
      corejs: "2.6.9"
    }
  ]
];
const plugins = [
  "@emotion",
  "@babel/plugin-proposal-class-properties",
  ["@babel/plugin-proposal-decorators", { legacy: true }],
  "@babel/plugin-proposal-export-default-from",
  "@babel/plugin-proposal-export-namespace-from",
  "@babel/plugin-proposal-function-sent",
  "@babel/plugin-proposal-json-strings",
  "@babel/plugin-proposal-nullish-coalescing-operator",
  "@babel/plugin-proposal-numeric-separator",
  "@babel/plugin-proposal-throw-expressions",
  "@babel/plugin-syntax-dynamic-import",
  "@babel/plugin-syntax-import-meta",
  "@babel/plugin-transform-destructuring",
  [
    "module-resolver",
    {
      root: ["./src"]
    }
  ]
];

if (process.env.NODE_ENV === "test") {
  plugins.push("dynamic-import-node");
}

// We'd prefer to export a function, per babel 7 docs, but as far as we can tell,
// Jest does not support an function exported from babel.config.js, so we need to
// export a hash.
module.exports = {
  presets,
  plugins
};
