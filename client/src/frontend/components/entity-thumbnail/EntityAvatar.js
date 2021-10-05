import React from "react";
import PropTypes from "prop-types";
import UniqueIcons from "global/components/icon/unique";

const AvatarImage = ({ entity }) => {
  if (!entity.attributes.avatarMeta.original) return null;
  const meta = entity.attributes.avatarMeta.original;
  const imageStyle =
    meta.width >= meta.height
      ? entity.attributes.avatarStyles.smallSquare
      : entity.attributes.avatarStyles.small;
  return <img src={imageStyle} alt="" />;
};

const PlaceholderImage = ({ entity }) => {
  if (!entity.attributes.avatarColor) return null;
  return (
    <>
      <UniqueIcons.ProjectPlaceholderUnique
        mode="responsive"
        color={entity.attributes.avatarColor}
        ariaLabel={false}
      />
    </>
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
