import frontendRoutesV6 from "frontend/routes-v6";
import backendRoutesV6 from "backend/routes-v6";
import readerRoutesV6 from "reader/routes-v6";
import Manifold from "global/containers/Manifold";
import linkHandler from "helpers/linkHandler";
import RouteError from "global/components/FatalError/RouteError";

export default function createRouter() {
  const allRoutes = [
    ...readerRoutesV6,
    ...frontendRoutesV6,
    ...backendRoutesV6
  ];

  const routes = [
    {
      element: <Manifold />,
      path: "/",
      errorElement: <RouteError />,
      children: allRoutes
    }
  ];

  // Register routes with linkHandler after they're created
  // This breaks the circular dependency since routes are already loaded
  linkHandler.registerRoutes(allRoutes);

  return routes;
}
