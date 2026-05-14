import { reactRouter } from "@react-router/dev/vite";
import babel from "vite-plugin-babel";
import { defineConfig, transformWithEsbuild } from "vite";
import path from "path";
import fs from "node:fs/promises";
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

export default defineConfig(({ isSsrBuild }) => ({
  assetsInclude: ["**/*.woff", "**/*.woff2"],
  plugins: [
    jsxInJsPlugin(),
    reactRouter(),
    babel({
      filter: /\.(js|jsx)$/,
      exclude: [/node_modules/],
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: true,
              ssr: true,
              pure: true,
              meaninglessFileNames: ["index", "styles"]
            }
          ]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, "app"),
      routes: path.resolve(__dirname, "app/routes"),
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
    include: [
      "styled-components",
      "@emotion/is-prop-valid",
      "stylis",
      "lodash-es",
      "date-fns",
      "date-fns/locale/en-US",
      "recharts",
      "react-ace",
      "slate"
    ],
    esbuildOptions: {
      // The loader map REPLACES esbuild defaults rather than merging, so
      // the .jsx/.ts/.tsx entries are required even though they look
      // tautological — without them, those extensions fall through to the
      // unknown-extension fallback ("js") and fail to parse.
      loader: {
        ".js": "jsx",
        ".jsx": "jsx",
        ".ts": "ts",
        ".tsx": "tsx"
      },
      // The optimizeDeps scanner runs its own bare esbuild that does not
      // honor the loader option for files it parses while crawling for
      // imports — only for files it loads. This plugin forces app .js
      // files (not node_modules) to be loaded as JSX during the scan,
      // eliminating "JSX syntax not enabled" noise on cold-cache startup.
      plugins: [
        {
          name: "load-app-js-as-jsx",
          setup(build) {
            build.onLoad(
              { filter: /\.jsx?$/, namespace: "file" },
              async args => {
                if (args.path.includes("/node_modules/")) return null;
                return {
                  loader: "jsx",
                  contents: await fs.readFile(args.path, "utf8")
                };
              }
            );
          }
        }
      ]
    }
  },
  ssr: {
    noExternal: isSsrBuild ? true : ["styled-components"]
  },
  build: {
    chunkSizeWarningLimit: 1500
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
