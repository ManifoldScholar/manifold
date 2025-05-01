"use strict";

const js = require("@eslint/js");
const prettier = require("eslint-plugin-prettier");
const reactHooks = require("eslint-plugin-react-hooks");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const { fixupPluginRules } = require("@eslint/compat");
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const globals = require("globals");
const unusedImports = require("eslint-plugin-unused-imports");
const imports = require("eslint-plugin-import");

module.exports = [
  {
    ignores: [
      "**/eslint.config.js",
      "webpack/*",
      "dist",
      "src/config.js",
      "src/utils/plugins",
      "plugins-off",
      "plugins.off",
      "tmp",
      "!tmp/.gitkeep",
      "codeshifts"
    ]
  },
  {
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules
    },
    plugins: {
      prettier,
      "jsx-a11y": jsxA11y,
      "react-hooks": fixupPluginRules(reactHooks)
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  reactRecommended,
  {
    languageOptions: {
      // parser: babelParser,
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "false",
        __DEVELOPMENT__: true,
        __BROWSER__: true,
        __SERVER__: false,
        __DISABLE_SSR__: true,
        __DEVTOOLS__: true,
        __API_URL__: true,
        __CABLE_URL__: true,
        socket: true,
        def: "readonly"
      }
    },
    plugins: {
      "unused-imports": unusedImports,
      import: imports
    },
    rules: {
      // Core ESLint rules
      "no-console": ["error", { allow: ["warn", "error", "debug", "info"] }],

      // React rules
      "react-hooks/rules-of-hooks": ["warn"],
      "react/react-in-jsx-scope": ["off"],
      "react/display-name": ["off"],
      "react/prop-types": ["off"],
      // tons of false positives from react-i18next <Trans> component
      "react/jsx-key": ["off"],
      "getter-return": 0,
      "no-prototype-builtins": 0,
      // Unused vars are bad.
      "no-unused-vars": [
        1,
        {
          args: "after-used",
          ignoreRestSiblings: true,
          varsIgnorePattern: "PropTypes|React",
          argsIgnorePattern: "[iI]gnored",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      // Unused import rules
      "unused-imports/no-unused-imports": ["warn"],
      // jsx-a11y
      "jsx-a11y/media-has-caption": 0,
      "jsx-a11y/click-events-have-key-events": 0,
      "jsx-a11y/mouse-events-have-key-events": 0
    }
  }
];
