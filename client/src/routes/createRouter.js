import frontendRoutesV6 from "frontend/routes-v6";
import Manifold from "global/containers/Manifold";
import linkHandler from "helpers/linkHandler";
import RouteError from "global/components/FatalError/RouteError";

export default function createRouter() {
  const routes = [
    {
      element: <Manifold />,
      path: "/",
      errorElement: <RouteError />,
      children: frontendRoutesV6
    }
  ];

  // Register routes with linkHandler after they're created
  // This breaks the circular dependency since routes are already loaded
  linkHandler.registerRoutes(frontendRoutesV6);

  return routes;
}
