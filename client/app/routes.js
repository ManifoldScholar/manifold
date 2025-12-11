import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...(await flatRoutes({ rootDirectory: "routes/frontend" })),
  ...(await flatRoutes({
    rootDirectory: "routes",
    ignoredRouteFiles: ["frontend/**"]
  }))
];
