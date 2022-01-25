import React from "react";
import PropTypes from "prop-types";
import IconComputed from "global/components/icon-computed";

function ProjectCollectionIcon({ projectCollection, ...props }) {
  const {
    icon,
    customIconStyles: { smallSquare }
  } = projectCollection.attributes;
  const fill =
    icon === "new-round" ? "var(--color-interaction-light)" : undefined;

  if (!icon && !smallSquare) return null;

  if (smallSquare)
    return <img src={smallSquare} alt="" width={60} height={60} {...props} />;

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
  "Frontend.Composed.EntityCollection.ProjectCollectionIcon";

ProjectCollectionIcon.propTypes = {
  projectCollection: PropTypes.object.isRequired
};

export default ProjectCollectionIcon;
