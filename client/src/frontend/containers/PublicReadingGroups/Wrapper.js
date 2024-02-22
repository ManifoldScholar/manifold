import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import { useFromStore } from "hooks";
import { useHistory, useLocation } from "react-router-dom";
import lh from "helpers/linkHandler";

function PublicReadingGroupsContainer({ route }) {
  const {
    attributes: {
      general: { disablePublicReadingGroups }
    }
  } = useFromStore("settings", "select");

  const history = useHistory();
  const { pathname } = useLocation();

  if (disablePublicReadingGroups && pathname === "/groups")
    history.push(lh.link("frontendMyReadingGroups"));

  return childRoutes(route);
}

PublicReadingGroupsContainer.propTypes = {
  route: PropTypes.object.isRequired
};

export default PublicReadingGroupsContainer;
