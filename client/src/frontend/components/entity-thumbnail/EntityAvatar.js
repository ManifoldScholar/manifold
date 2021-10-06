import React from "react";
import PropTypes from "prop-types";
import UniqueIcons from "global/components/icon/unique";
import * as Styled from "./EntityAvatar.styles";

const AvatarImage = ({ entity }) => {
  if (!entity.attributes.avatarMeta.original) return null;
  const meta = entity.attributes.avatarMeta.original;
  const imageStyle =
    meta.width >= meta.height
      ? entity.attributes.avatarStyles.smallSquare
      : entity.attributes.avatarStyles.small;

  /* need to fix the alt here */
  return <Styled.Avatar src={imageStyle} alt="" />;
};

const PlaceholderImage = ({ entity }) => {
  if (!entity.attributes.avatarColor) return null;
  return (
    <Styled.Placeholder>
      <UniqueIcons.ProjectPlaceholderUnique
        mode="responsive"
        color={entity.attributes.avatarColor}
        ariaLabel={false}
      />
    </Styled.Placeholder>
  );
};

export default function EntityAvatar({ entity }) {
  if (!entity) return null;
  return entity.attributes.avatarStyles.original ? (
    <AvatarImage entity={entity} />
  ) : (
    <PlaceholderImage entity={entity} />
  );
}

EntityAvatar.propTypes = {
  entity: PropTypes.object
};
