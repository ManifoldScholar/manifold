import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import ResourceList from "frontend/components/resource-list";
import ResourceCollection from "frontend/components/resource-collection";
import EntityCollection from "../../EntityCollection";
import SlideshowSection from "./SlideshowSection";
import * as shapes from "../../shapes";
import * as Styled from "./styles";

function ProjectResourceCollectionDetail({
  resourceCollection,
  resources,
  slideshowResources,
  slideshowResourcesMeta,
  project,
  meta,
  filterProps,
  paginationProps,
  dispatch,
  listHeaderId,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  return (
    <EntityCollection
      title={resourceCollection.attributes.title}
      icon="resourceCollection64"
      collectingProps={{ collectable: resourceCollection }}
      DescriptionComponent={props => (
        <ResourceCollection.Description
          date={resourceCollection.attributes.createdAt}
          description={resourceCollection.attributes.descriptionFormatted}
          {...props}
        />
      )}
      headerLayout="title_description_image"
      headerWidth="100%"
      ImageComponent={props => (
        <>
          <SlideshowSection
            slideshowResourcesMeta={slideshowResourcesMeta}
            resourceCollection={resourceCollection}
            slideshowResources={slideshowResources}
            dispatch={dispatch}
            {...props}
          />
          <Styled.SectionHeader id={listHeaderId}>
            {t("pages.subheaders.resource_list")}
          </Styled.SectionHeader>
        </>
      )}
      BodyComponent={props => (
        <>
          <ResourceList.Cards
            resourceCollection={resourceCollection}
            project={project}
            resources={resources}
            itemHeadingLevel={3}
            {...props}
          />
        </>
      )}
      filterProps={filterProps}
      containerWrapPoint="1200px"
      countProps={
        isEmpty(meta)
          ? {}
          : {
              pagination: get(meta, "pagination"),
              unit: t("glossary.resource", {
                count: meta?.pagination?.totalCount || 0
              })
            }
      }
      paginationProps={
        isEmpty(meta)
          ? {}
          : {
              pagination: get(meta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

ProjectResourceCollectionDetail.displayName =
  "Frontend.Entity.Collection.ProjectResourceCollectionDetail";

ProjectResourceCollectionDetail.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  resources: PropTypes.array,
  slideshowResources: PropTypes.array,
  meta: PropTypes.object,
  slideshowResourcesMeta: PropTypes.object,
  filterProps: shapes.filters,
  paginationProps: shapes.pagination,
  dispatch: PropTypes.func,
  listHeaderId: PropTypes.string
};

export default ProjectResourceCollectionDetail;
