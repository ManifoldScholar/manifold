import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const CoverAvatar = ({ entity }) => {
  const meta = entity.attributes.avatarMeta.original;
  const avatarSrc =
    meta.width >= meta.height
      ? entity.attributes.avatarStyles.smallSquare
      : entity.attributes.avatarStyles.small;

  return <Styled.Avatar src={avatarSrc} alt="" />;
};

CoverAvatar.displayName = "Global.Atomic.EntityAvatar.Cover";

CoverAvatar.propTypes = {
  entity: PropTypes.object,
  stack: PropTypes.bool
};

export default CoverAvatar;
