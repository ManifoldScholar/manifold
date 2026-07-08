import frontendRoutes from "frontend/routes";
import backendRoutes from "backend/routes";
import readerRoutes from "reader/routes";
import ltiRoutes from "lti/routes";
import Manifold from "global/containers/Manifold";
import linkHandler from "helpers/linkHandler";
import RouteError from "global/components/FatalError/RouteError";

export default function createRouter() {
  const allRoutes = [
    ...readerRoutes,
    ...frontendRoutes,
    ...backendRoutes,
    ...ltiRoutes
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
