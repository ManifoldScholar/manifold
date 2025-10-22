import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
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
  const headerLayout = getHeaderLayout(projectCollection);
  const image = getHeroImage(headerLayout, projectCollection);
  const imageAlt = projectCollection.attributes.heroAltText;
  const showFilters = !isEmpty(projectsMeta) && !isEmpty(filterProps);

  const { t } = useTranslation();

  return (
    <EntityCollection
      title={title}
      description={description}
      IconComponent={ProjectCollectionIcon}
      iconProps={{ collection: projectCollection }}
      image={image}
      imageAlt={imageAlt}
      headerLayout={headerLayout}
      headerWidth="100%"
      filterProps={showFilters ? filterProps : null}
      BodyComponent={props =>
        !!projects?.length && (
          <ThumbnailGrid isList={projects.length > 1} {...props}>
            {({ stack }) =>
              projects.map(item => (
                <EntityThumbnail
                  key={item.id}
                  entity={item}
                  stack={stack}
                  isListItem={projects.length > 1}
                />
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
                count: projectsMeta?.pagination?.totalCount || 0
              })
            }
      }
      paginationProps={
        isEmpty(projectsMeta)
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
  "Frontend.Entity.Collection.ProjectCollectionDetail";

ProjectCollectionDetailEntityCollection.propTypes = {
  projectCollection: PropTypes.object.isRequired,
  projects: PropTypes.arrayOf(PropTypes.object),
  projectsMeta: PropTypes.object,
  limit: PropTypes.number
};

export default ProjectCollectionDetailEntityCollection;
