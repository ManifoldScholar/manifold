import React from "react";
import PropTypes from "prop-types";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import Template from "../../Template";

function CollectedProjects({ onUncollect, ...props }) {
  return (
    <Template
      {...props}
      type="projects"
      ListComponent={ThumbnailGrid}
      ResponseComponent={({ response, ...restProps }) => (
        <EntityThumbnail
          entity={response}
          onUncollect={onUncollect}
          {...restProps}
        />
      )}
    />
  );
}

CollectedProjects.displayName = "Collecting.CollectedProjects";

CollectedProjects.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onUncollect: PropTypes.func,
  nested: PropTypes.bool
};

export default CollectedProjects;
