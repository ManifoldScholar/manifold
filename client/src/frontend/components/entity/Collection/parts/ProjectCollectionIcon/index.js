import React from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

function ProjectCollectionIcon({ collection, ...props }) {
  const { icon, customIconStyles } = collection.attributes;
  const fill =
    icon === "new-round" ? "var(--color-interaction-light)" : undefined;

  if (!icon && !customIconStyles?.smallSquare) return null;

  if (customIconStyles?.smallSquare)
    return (
      <img
        src={customIconStyles.smallSquare}
        alt=""
        width={60}
        height={60}
        {...props}
      />
    );

  return (
    <IconComputed.ProjectCollection
      icon={icon}
      size={60}
      svgProps={fill ? { style: { fill } } : {}}
      {...props}
    />
  );
}

ProjectCollectionIcon.displayName =
  "Frontend.Entity.Collection.ProjectCollectionIcon";

ProjectCollectionIcon.propTypes = {
  collection: PropTypes.object.isRequired
};

export default ProjectCollectionIcon;
