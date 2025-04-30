import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Static from "global/components/navigation/Static";
import Mobile from "global/components/navigation/Mobile";
import { Link, useLocation } from "react-router-dom";
import { getAdminModeLabel, getDestinationPath } from "./helpers";
import { useFromStore } from "hooks";
import Authorization from "helpers/authorization";

export default function NavigationPrimary(props) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const currentUser = props.authentication.currentUser;

  const label = getAdminModeLabel({ currentUser, mode: props.mode, t });

  const resources = useFromStore(`entityStore.entities.resources`);
  const resourceCollections = useFromStore(
    `entityStore.entities.resourceCollections`
  );
  const pages = useFromStore(`entityStore.entities.pages`);
  const texts = useFromStore(`entityStore.entities.texts`);

  const to = getDestinationPath({
    mode: props.mode,
    pathname,
    entities: { resources, resourceCollections, pages, texts }
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
        {...props}
        style={props.desktopStyle}
      />
      <Mobile
        backendButton={adminModeButton}
        {...props}
        style={props.mobileStyle}
      />
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
