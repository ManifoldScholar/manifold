import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import ProjectList from "frontend/components/project-list";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function ProjectsEntityCollection({
  projects,
  projectsMeta,
  filterProps,
  paginationProps,
  ...passThroughProps
}) {
  const showPagination = !isEmpty(projectsMeta) && !isEmpty(paginationProps);
  const showFilters = !isEmpty(projectsMeta) && !isEmpty(filterProps);
  return (
    <EntityCollection
      title="All Projects"
      icon="projects64"
      UtilityComponent={props =>
        showFilters && <ProjectList.Filters {...props} {...filterProps} />
      }
      BodyComponent={props => (
        <ThumbnailGrid {...props}>
          {({ stack }) =>
            projects.map(item => (
              <EntityThumbnail key={item.id} entity={item} stack={stack} />
            ))
          }
        </ThumbnailGrid>
      )}
      countProps={
        !projectsMeta
          ? {}
          : {
              pagination: get(projectsMeta, "pagination"),
              singularUnit: "project",
              pluralUnit: "projects"
            }
      }
      paginationProps={
        !showPagination
          ? {}
          : {
              pagination: get(projectsMeta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

ProjectsEntityCollection.displayName =
  "Global.Composed.EntityCollection.Projects";

ProjectsEntityCollection.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectsMeta: PropTypes.object,
  filterProps: shapes.filters,
  paginationProps: shapes.pagination
};

export default ProjectsEntityCollection;
