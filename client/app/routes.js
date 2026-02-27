import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...(await flatRoutes({ rootDirectory: "routes/backend" })),
  ...(await flatRoutes({ rootDirectory: "routes/frontend" })),
  ...(await flatRoutes({ rootDirectory: "routes/global" })),
  ...(await flatRoutes({ rootDirectory: "routes/reader" })),
  ...(await flatRoutes({
    rootDirectory: "routes",
    ignoredRouteFiles: ["backend/**", "frontend/**", "global/**", "reader/**"]
  }))
];
