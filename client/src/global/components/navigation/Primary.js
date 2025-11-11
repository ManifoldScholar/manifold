import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Static from "global/components/navigation/Static";
import Mobile from "global/components/navigation/Mobile";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom-v5-compat";
import { getAdminModeLabel, getDestinationPath } from "./helpers";
import { useFromStore } from "hooks";
import Authorization from "helpers/authorization";

export default function NavigationPrimary(props) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const currentUser = props.authentication.currentUser;

  const label = getAdminModeLabel({ currentUser, mode: props.mode, t });

  const resources = useFromStore({ path: `entityStore.entities.resources` });
  const resourceCollections = useFromStore({
    path: `entityStore.entities.resourceCollections`
  });
  const pages = useFromStore({ path: `entityStore.entities.pages` });
  const texts = useFromStore({ path: `entityStore.entities.texts` });
  const fatalError = useFromStore({ path: "fatalError" });

  const to = getDestinationPath({
    mode: props.mode,
    pathname,
    entities: { resources, resourceCollections, pages, texts },
    fatalError
  });

  const authorization = new Authorization();
  const canAccessAdmin = authorization.authorizeKind({
    authentication: props.authentication,
    kind: [
      "admin",
      "editor",
      "marketeer",
      "project_creator",
      "project_editor",
      "project_property_manager",
      "journal_editor"
    ]
  });

  const adminModeButton = canAccessAdmin ? (
    <Link className="mode-button" to={to}>
      {label}
    </Link>
  ) : null;

  return (
    <>
      <Static
        backendButton={adminModeButton}
        style={props.desktopStyle}
        {...props}
      />
      <Mobile backendButton={adminModeButton} {...props} />
    </>
  );
}

NavigationPrimary.displayName = "Navigation.Primary";

NavigationPrimary.propTypes = {
  links: PropTypes.array,
  authentication: PropTypes.object,
  visibility: PropTypes.object,
  commonActions: PropTypes.object.isRequired,
  mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
  exact: PropTypes.bool,
  desktopStyle: PropTypes.object,
  mobileStyle: PropTypes.object
};
