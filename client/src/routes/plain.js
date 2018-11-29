import frontendRoutes from "frontend/routes";
import backendRoutes from "backend/routes";
import readerRoutes from "reader/routes";

export default () => {
  return [readerRoutes, frontendRoutes, backendRoutes];
};
