import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const CoverAvatar = ({ entity }) => {
  const meta = entity.attributes.avatarMeta?.original;
  const avatarKey = meta.width >= meta.height ? "smallSquare" : "small";
  const src = entity.attributes.avatarStyles[avatarKey];
  const { width, height } = entity.attributes.avatarMeta[avatarKey] ?? {};
  const alt = entity.attributes.avatarAltText;

  return (
    <Styled.Avatar
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      loading="lazy"
    />
  );
};

CoverAvatar.displayName = "Global.Atomic.EntityAvatar.Cover";

CoverAvatar.propTypes = {
  entity: PropTypes.object,
  stack: PropTypes.bool
};

export default CoverAvatar;
