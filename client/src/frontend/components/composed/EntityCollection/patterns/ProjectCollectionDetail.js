import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/composed/ThumbnailGrid";
import EntityCollection from "../EntityCollection";
import { ProjectCollectionIcon } from "../parts";
import { getHeroImage, getHeaderLayout } from "../helpers";
import { useListFilters } from "hooks";

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
  const headerLayout = getHeaderLayout(projectCollection);
  const image = getHeroImage(headerLayout, projectCollection);
  const showPagination = !isEmpty(projectsMeta) && !isEmpty(paginationProps);
  const showFilters = !isEmpty(projectsMeta) && !isEmpty(filterProps);

  const listFilterProps = useListFilters({ ...filterProps });
  const { t } = useTranslation();

  return (
    <EntityCollection
      title={title}
      description={description}
      IconComponent={props => (
        <ProjectCollectionIcon {...props} collection={projectCollection} />
      )}
      image={image}
      headerLayout={headerLayout}
      headerWidth="100%"
      filterProps={showFilters ? listFilterProps : null}
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
              unit: t("glossary.project", {
                count: projectsMeta?.pagination?.totalCount
              })
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
  "Frontend.Composed.EntityCollection.ProjectCollectionDetail";

ProjectCollectionDetailEntityCollection.propTypes = {
  projectCollection: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectsMeta: PropTypes.object,
  limit: PropTypes.number
};

export default ProjectCollectionDetailEntityCollection;
