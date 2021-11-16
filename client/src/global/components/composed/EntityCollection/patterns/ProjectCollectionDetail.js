import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import ProjectList from "frontend/components/project-list";
import EntityCollection from "../EntityCollection";
import { ProjectCollectionIcon } from "../parts";
import { getHeroImage, getHeaderLayout } from "../helpers";

function ProjectCollectionDetailEntityCollection({
  projectCollection,
  projects,
  projectsMeta,
  paginationProps,
  filterProps,
  limit,
  ...passThroughProps
}) {
  const {
    title,
    descriptionFormatted: description
  } = projectCollection.attributes;
  const image = getHeroImage(projectCollection);
  const headerLayout = getHeaderLayout(projectCollection);
  const showPagination = !isEmpty(projectsMeta) && !isEmpty(paginationProps);
  const showFilters = !isEmpty(projectsMeta) && !isEmpty(filterProps);

  return (
    <EntityCollection
      title={title}
      description={description}
      IconComponent={props => (
        <ProjectCollectionIcon
          {...props}
          projectCollection={projectCollection}
        />
      )}
      image={image}
      headerLayout={headerLayout}
      UtilityComponent={props =>
        showFilters && <ProjectList.Filters {...props} {...filterProps} />
      }
      BodyComponent={props =>
        !!projects?.length && (
          <ThumbnailGrid {...props}>
            {({ stack }) =>
              projects.map(item => (
                <EntityThumbnail key={item.id} entity={item} stack={stack} />
              ))
            }
          </ThumbnailGrid>
        )
      }
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

ProjectCollectionDetailEntityCollection.displayName =
  "Global.Composed.EntityCollection.ProjectCollectionDetail";

ProjectCollectionDetailEntityCollection.propTypes = {
  projectCollection: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectsMeta: PropTypes.object,
  limit: PropTypes.number
};

export default ProjectCollectionDetailEntityCollection;
