import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";

function PublicReadingGroupsContainer({ route }) {
  return childRoutes(route);
}

PublicReadingGroupsContainer.propTypes = {
  route: PropTypes.object.isRequired
};

export default PublicReadingGroupsContainer;
