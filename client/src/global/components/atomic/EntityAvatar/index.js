import * as React from "react";
import PropTypes from "prop-types";
import CoverAvatar from "./CoverAvatar";
import PlaceholderAvatar from "./PlaceholderAvatar";

export default function EntityAvatar({ entity }) {
  const placeholder = !entity.attributes?.avatarStyles?.original;

  return placeholder ? (
    <PlaceholderAvatar entity={entity} />
  ) : (
    <CoverAvatar entity={entity} />
  );
}

EntityAvatar.displayName = "Global.Atomic.EntityAvatar";

EntityAvatar.propTypes = {
  entity: PropTypes.object.isRequired
};
