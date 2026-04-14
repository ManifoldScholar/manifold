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

function emotionTransformPlugin() {
  return {
    name: "emotion-transform",
    async transform(code, id) {
      if (!/\.(js|jsx)$/.test(id) || id.includes("node_modules")) {
        return null;
      }
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
  };
}

export default defineConfig(() => ({
  assetsInclude: ["**/*.woff", "**/*.woff2"],
  plugins: [jsxInJsPlugin(), emotionTransformPlugin(), reactRouter()],
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
    include: ["@emotion/react", "@emotion/styled"],
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  ssr: {
    external: ["lodash"]
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
