import React from "react";
import PropTypes from "prop-types";
import UniqueIcons from "global/components/icon/unique";
import Image from "global/components/atomic/Image";
import classNames from "classnames";

const Cover = ({ entity, blockClass = "project-hero" }) => {
  const cover = () => {
    const { coverStyles, avatarMeta } = entity.attributes;
    if (!coverStyles || !avatarMeta) return;
    return {
      url: entity.attributes.coverStyles.medium,
      width: "100%",
      height: "auto"
    };
  };

  const renderAvatarImage = () => {
    if (!entity.attributes.avatarMeta.original) return null;
    const meta = entity.attributes.avatarMeta.original;
    const imageStyle =
      meta.width >= meta.height
        ? entity.attributes.avatarStyles.smallSquare
        : entity.attributes.avatarStyles.small;
    return <Image image={imageStyle} title="Cover" />;
  };

  const renderPlaceholderImage = () => {
    if (!entity.attributes.avatarColor) return null;
    return (
      <UniqueIcons.ProjectPlaceholderUnique
        mode="responsive"
        color={entity.attributes.avatarColor}
        ariaLabel={false}
      />
    );
  };

  const figureClassNames = classNames(`${blockClass}__figure`, {
    [`${blockClass}__figure--constrained`]: !cover().url
  });

  return (
    <div className={`${blockClass}__cover-block`}>
      <figure className={figureClassNames}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {cover() ? (
          <Image image={cover()} title="Cover" />
        ) : entity.attributes.avatarStyles.original ? (
          renderAvatarImage()
        ) : (
          renderPlaceholderImage()
        )}
      </figure>
    </div>
  );
};

Cover.displayName = "Entity.Cover";

Cover.propTypes = {
  blockClass: PropTypes.string,
  entity: PropTypes.object.isRequired
};

export default Cover;
