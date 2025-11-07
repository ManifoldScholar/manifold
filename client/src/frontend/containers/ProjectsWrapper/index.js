import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";

export default function ProjectsWrapper({ route }) {
  return renderRoutes(route.routes);
}
