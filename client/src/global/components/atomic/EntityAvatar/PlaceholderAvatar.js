import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const PlaceholderAvatar = ({ entity }) => {
  if (!entity.attributes?.avatarColor) return null;
  return (
    <Styled.Placeholder
      mode="responsive"
      color={entity.attributes.avatarColor}
      ariaLabel={false}
    />
  );
};

PlaceholderAvatar.displayName = "Global.Atomic.EntityAvatar.Placeholder";

PlaceholderAvatar.propTypes = {
  entity: PropTypes.object,
  stack: PropTypes.bool
};

export default PlaceholderAvatar;
