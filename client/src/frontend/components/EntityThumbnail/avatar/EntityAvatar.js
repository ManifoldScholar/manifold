import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./EntityAvatar.styles";

const AvatarIcon = ({ entity }) => {
  const meta = entity.attributes.avatarMeta.original;
  const avatarSrc =
    meta.width >= meta.height
      ? entity.attributes.avatarStyles.smallSquare
      : entity.attributes.avatarStyles.small;

  /* need to fix the alt here */
  return <Styled.Avatar src={avatarSrc} alt="" />;
};

AvatarIcon.propTypes = {
  entity: PropTypes.object
};

export default AvatarIcon;
