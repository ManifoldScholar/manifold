import * as React from "react";
import PropTypes from "prop-types";
import CoverAvatar from "./CoverAvatar";
import PlaceholderAvatar from "./PlaceholderAvatar";
import LogoAvatar from "./LogoAvatar";

export default function EntityAvatar({ entity }) {
  const placeholder = !entity.attributes?.avatarStyles?.original;
  const logo = entity.attributes?.logoStyles?.original;

  if (logo) return <LogoAvatar entity={entity} />;

  if (placeholder) return <PlaceholderAvatar entity={entity} />;

  return <CoverAvatar entity={entity} />;
}

EntityAvatar.displayName = "Global.Atomic.EntityAvatar";

EntityAvatar.propTypes = {
  entity: PropTypes.object.isRequired
};
