import { useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Static from "components/global/navigation/Static";
import Mobile from "components/global/navigation/Mobile";
import { Link, useLocation } from "react-router";
import { getAdminModeLabel, getDestinationPath } from "./helpers";
import { AppContext } from "app/contexts";
import { useLoaderCollection, useAuthentication } from "hooks";
import Authorization from "helpers/authorization";

export default function NavigationPrimary(props) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const authentication = useAuthentication();
  const { currentUser } = authentication;

  const label = getAdminModeLabel({ currentUser, mode: props.mode, t });

  const { pages: pagesArray } = useContext(AppContext);

  // This isn't quite right. Fix after BE routes are migrated.
  const resources = useLoaderCollection("resources");
  const resourceCollections = useLoaderCollection("resource_collections");
  const texts = useLoaderCollection("texts");

  const toEntityMap = arr =>
    arr ? Object.fromEntries(arr.map(item => [item.id, item])) : {};
  const entities = {
    resources: toEntityMap(resources),
    resourceCollections: toEntityMap(resourceCollections),
    pages: toEntityMap(pagesArray),
    texts: toEntityMap(texts)
  };

  const to = getDestinationPath({
    mode: props.mode,
    pathname,
    entities
  });

  const authorization = new Authorization();
  const canAccessAdmin = authorization.authorizeKind({
    authentication,
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
  mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
  exact: PropTypes.bool,
  desktopStyle: PropTypes.object,
  mobileStyle: PropTypes.object
};
