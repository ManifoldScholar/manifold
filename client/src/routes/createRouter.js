import frontendRoutesV6 from "frontend/routes-v6";
import Manifold from "global/containers/Manifold";
import linkHandler from "helpers/linkHandler";

export default function createRouter() {
  // Wrap frontend routes with Manifold as the root route
  // Manifold provides global UI (notifications, overlays, etc.)
  // and renders an Outlet for child routes
  const routes = [
    {
      element: <Manifold />,
      path: "/",
      children: frontendRoutesV6
    }
  ];

  // Register routes with linkHandler after they're created
  // This breaks the circular dependency since routes are already loaded
  // when this function is called, so there's no import cycle
  linkHandler.registerRoutes(frontendRoutesV6);

  return routes;
}
