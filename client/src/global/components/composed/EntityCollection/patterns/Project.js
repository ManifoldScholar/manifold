import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import ProjectList from "frontend/components/project-list";
import EntityCollection from "../EntityCollection";

function ProjectEntityCollection({
  projects,
  projectsMeta,
  filterProps,
  paginationProps
}) {
  return (
    <EntityCollection
      title="All Projects"
      icon="projects64"
      FilterComponent={props => (
        <ProjectList.Filters {...props} {...filterProps} />
      )}
      ListComponent={props => (
        <ThumbnailGrid {...props}>
          {({ stack }) =>
            projects.map(item => (
              <EntityThumbnail entity={item} stack={stack} />
            ))
          }
        </ThumbnailGrid>
      )}
      countProps={{
        pagination: get(projectsMeta, "pagination"),
        singularUnit: "project",
        pluralUnit: "projects"
      }}
      paginationProps={
        !paginationProps
          ? {}
          : {
              pagination: get(projectsMeta, "pagination"),
              ...paginationProps
            }
      }
    />
  );
}

ProjectEntityCollection.displayName = "Global.Composed.ProjectEntityCollection";

ProjectEntityCollection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectsMeta: PropTypes.object.isRequired,
  filterProps: PropTypes.shape({
    filterChangeHandler: PropTypes.func,
    initialFilterState: PropTypes.object,
    resetFilterState: PropTypes.object,
    subjects: PropTypes.array
  })
};

export default ProjectEntityCollection;
