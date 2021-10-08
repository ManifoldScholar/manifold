import React from "react";
import PropTypes from "prop-types";
import UniqueIcons from "global/components/icon/unique";
import * as Styled from "./EntityAvatar.styles";

const PlaceholderAvatar = ({ entity, stack }) => {
  if (!entity.attributes.avatarColor) return null;
  return (
    <Styled.Placeholder stack={stack}>
      <UniqueIcons.ProjectPlaceholderUnique
        mode="responsive"
        color={entity.attributes.avatarColor}
        ariaLabel={false}
      />
    </Styled.Placeholder>
  );
};

PlaceholderAvatar.propTypes = {
  entity: PropTypes.object,
  stack: PropTypes.bool
};

export default PlaceholderAvatar;
