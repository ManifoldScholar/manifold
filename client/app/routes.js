import { recursiveFlatRoutes } from "./lib/utils/react-router/recursiveFlatRoutes";

const ignoredRouteFiles = [
  "**/styles.js",
  "**/ErrorBoundary.jsx",
  "**/filters.js"
];

export default [
  ...(await recursiveFlatRoutes({
    rootDirectory: "routes",
    ignoredRouteFiles: [...ignoredRouteFiles, "utility/**"]
  }))
];
