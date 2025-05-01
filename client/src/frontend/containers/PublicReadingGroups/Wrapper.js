import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import { useFromStore } from "hooks";
import { useNavigate, useLocation } from "react-router-dom-v5-compat";
import lh from "helpers/linkHandler";

function PublicReadingGroupsContainer({ route }) {
  const {
    attributes: {
      general: { disablePublicReadingGroups },
    },
  } = useFromStore("settings", "select");

  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (disablePublicReadingGroups && pathname === "/groups")
    navigate(lh.link("frontendMyReadingGroups"));

  return childRoutes(route);
}

PublicReadingGroupsContainer.propTypes = {
  route: PropTypes.object.isRequired,
};

export default PublicReadingGroupsContainer;
