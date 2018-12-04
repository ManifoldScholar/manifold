import frontendRoutes from "frontend/routes";
import backendRoutes from "backend/routes";
import readerRoutes from "reader/routes";
import frontendRouteContainers from "frontend/containers/route-containers";
import backendRouteContainers from "backend/containers/route-containers";
import readerRouteContainers from "reader/containers/route-containers";
import NotFound from "global/containers/NotFound";
import hydrate from "./hydrate";

export default () => {
  return [
    hydrate(readerRoutes, readerRouteContainers),
    hydrate(backendRoutes, backendRouteContainers),
    hydrate(frontendRoutes, frontendRouteContainers),
    { component: NotFound }
  ];
};
