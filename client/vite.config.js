import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, transformWithEsbuild } from "vite";
import path from "path";
import * as babel from "@babel/core";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

function styledComponentsTransformPlugin() {
  return {
    name: "styled-components-transform",
    // Run before reactRouter's react-refresh-babel pass so Fast Refresh
    // operates on our final output and isn't clobbered by a later Babel
    // round-trip. `babel-plugin-styled-components` is not foldable into
    // reactRouter's own Babel call (no public hook in @react-router/dev
    // v7), so we stay as a standalone transform.
    enforce: "pre",
    async transform(code, id) {
      if (!/\.(js|jsx)$/.test(id) || id.includes("node_modules")) {
        return null;
      }
      if (!/from ['"]styled-components['"]/.test(code)) {
        return null;
      }

      const result = await babel.transformAsync(code, {
        filename: id,
        babelrc: false,
        configFile: false,
        plugins: [
          [
            "babel-plugin-styled-components",
            { ssr: true, displayName: true, fileName: true, pure: true }
          ]
        ],
        sourceMaps: true,
        sourceType: "module"
      });

      if (result?.code) {
        return { code: result.code, map: result.map };
      }
      return null;
    }
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  assetsInclude: ["**/*.woff", "**/*.woff2"],
  plugins: [jsxInJsPlugin(), styledComponentsTransformPlugin(), reactRouter()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "app"),
      lib: path.resolve(__dirname, "app/lib"),
      contexts: path.resolve(__dirname, "app/contexts"),
      components: path.resolve(__dirname, "app/components"),
      helpers: path.resolve(__dirname, "app/lib/helpers"),
      hooks: path.resolve(__dirname, "app/hooks"),
      api: path.resolve(__dirname, "app/lib/api"),
      utils: path.resolve(__dirname, "app/lib/utils"),
      theme: path.resolve(__dirname, "app/theme")
    }
  },
  optimizeDeps: {
    entries: ["app/**/*.{js,jsx}"],
    include: [
      "styled-components",
      "@emotion/is-prop-valid",
      "stylis",
      "lodash-es",
      "date-fns",
      "date-fns/locale/en-US"
    ],
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  ssr: {
    noExternal: isSsrBuild ? true : ["styled-components"]
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
