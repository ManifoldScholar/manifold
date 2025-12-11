import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, transformWithEsbuild } from "vite";
import path from "path";
import * as babel from "@babel/core";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom plugin to replace __BROWSER__ and __SERVER__ with runtime checks
function webpackGlobalsPlugin() {
  return {
    name: "webpack-globals",
    transform(code, id) {
      if (id.includes("node_modules")) return null;
      if (!code.includes("__BROWSER__") && !code.includes("__SERVER__"))
        return null;

      const transformed = code
        .replace(/\b__BROWSER__\b/g, "(typeof window !== 'undefined')")
        .replace(/\b__SERVER__\b/g, "(typeof window === 'undefined')");

      return { code: transformed, map: null };
    }
  };
}

// Plugin to transform JSX in .js files BEFORE import analysis
function jsxInJsPlugin() {
  return {
    name: "jsx-in-js",
    enforce: "pre",
    async transform(code, id) {
      // Process .js and .jsx files that aren't in node_modules
      if (!/\.(js|jsx)$/.test(id) || id.includes("node_modules")) {
        return null;
      }

      // Use esbuild to transform JSX
      return transformWithEsbuild(code, id, {
        loader: "jsx",
        jsx: "automatic"
      });
    }
  };
}

export default defineConfig(({ mode }) => ({
  assetsInclude: ["**/*.woff", "**/*.woff2"],
  define: {
    // Make process.env variables available
    "process.env.CLIENT_SERVER_API_URL": JSON.stringify(
      process.env.CLIENT_SERVER_API_URL || "http://localhost:13110"
    ),
    "process.env.CLIENT_BROWSER_API_URL": JSON.stringify(
      process.env.CLIENT_BROWSER_API_URL || "http://127.0.0.1:13110"
    ),
    "process.env.CLIENT_BROWSER_API_CABLE_URL": JSON.stringify(
      process.env.CLIENT_BROWSER_API_CABLE_URL || "http://127.0.0.1:13120/cable"
    ),
    "process.env.DOMAIN": JSON.stringify(
      process.env.DOMAIN || "127.0.0.1:13100"
    ),
    "process.env.SSL_ENABLED": JSON.stringify(
      process.env.SSL_ENABLED || "false"
    ),
    "process.env.CLIENT_SERVER_PORT": JSON.stringify(
      process.env.CLIENT_SERVER_PORT || "5173"
    ),
    "process.env.NODE_ENV": JSON.stringify(mode)
  },
  plugins: [
    jsxInJsPlugin(),
    webpackGlobalsPlugin(),
    // Custom Emotion transform plugin
    {
      name: "emotion-transform",
      async transform(code, id) {
        // Only process JS/JSX files in src/ that might use Emotion
        if (!/\.(js|jsx)$/.test(id) || id.includes("node_modules")) {
          return null;
        }
        // Skip if no styled or css imports
        if (!code.includes("@emotion") && !code.includes("styled")) {
          return null;
        }

        const result = await babel.transformAsync(code, {
          filename: id,
          babelrc: false,
          configFile: false,
          plugins: ["@emotion"],
          sourceMaps: true,
          sourceType: "module"
        });

        if (result?.code) {
          return { code: result.code, map: result.map };
        }
        return null;
      }
    },
    reactRouter()
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "app"),
      global: path.resolve(__dirname, "src/global"),
      frontend: path.resolve(__dirname, "src/frontend"),
      backend: path.resolve(__dirname, "src/backend"),
      reader: path.resolve(__dirname, "src/reader"),
      helpers: path.resolve(__dirname, "src/helpers"),
      hooks: path.resolve(__dirname, "src/hooks"),
      hoc: path.resolve(__dirname, "src/hoc"),
      store: path.resolve(__dirname, "src/store"),
      actions: path.resolve(__dirname, "src/actions"),
      api: path.resolve(__dirname, "src/api"),
      utils: path.resolve(__dirname, "src/utils"),
      theme: path.resolve(__dirname, "src/theme"),
      config: path.resolve(__dirname, "src/config"),
      routes: path.resolve(__dirname, "src/routes"),
      services: path.resolve(__dirname, "src/services"),
      plugins: path.resolve(
        __dirname,
        "src/utils/plugins/missingPluginsManifest.js"
      )
    }
  },
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled"],
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  ssr: {
    external: ["lodash", "redux-promise"]
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:13110",
        changeOrigin: true
      },
      "/system": {
        target: "http://localhost:13110",
        changeOrigin: true
      },
      "/auth": {
        target: "http://localhost:13110",
        changeOrigin: true
      }
    }
  }
}));
