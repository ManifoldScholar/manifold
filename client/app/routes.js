import { recursiveFlatRoutes } from "./utils/recursiveFlatRoutes";

const ignoredRouteFiles = ["**/styles.js", "**/ErrorBoundary.jsx"];

export default [
  ...(await recursiveFlatRoutes({
    rootDirectory: "routes",
    ignoredRouteFiles: [...ignoredRouteFiles, "utility/**"]
  }))
];
