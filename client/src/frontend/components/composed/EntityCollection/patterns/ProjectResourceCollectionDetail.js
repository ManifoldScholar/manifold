import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import FormattedDate from "global/components/FormattedDate";
import EntityListTotal from "global/components/composed/EntityListTotal";
import ResourceList from "frontend/components/resource-list";
import lh from "helpers/linkHandler";
import { useListFilters } from "hooks";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function ProjectResourceCollectionDetail({
  resourceCollection,
  resources,
  slideshowResources,
  slideshowResourcesMeta,
  project,
  meta,
  filterProps: passedFilterProps,
  paginationProps,
  dispatch,
  listHeaderId,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  const showPagination = !isEmpty(meta) && !isEmpty(paginationProps);
  const totalCount = resourceCollection.attributes.collectionResourcesCount;
  const filterProps = useListFilters({
    ...passedFilterProps,
    options: {
      sort: true,
      kinds: resourceCollection.attributes.resourceKinds,
      tags: resourceCollection.attributes.resourceTags
    }
  });

  return (
    <EntityCollection
      title={resourceCollection.attributes.title}
      icon="resourceCollection64"
      collectingProps={{ collectable: resourceCollection }}
      DescriptionComponent={props => (
        <FormattedDate
          prefix={t("dates.collection_created")}
          format="MMMM yyyy"
          date={resourceCollection.attributes.createdAt}
          {...props}
        />
      )}
      headerLayout="title_description_image"
      headerWidth="100%"
      ImageComponent={props =>
        isEmpty(slideshowResourcesMeta) ? null : (
          <div {...props}>
            <h2 className="screen-reader-text">
              {t("pages.subheaders.resource_slideshow")}
            </h2>
            <ResourceList.Slideshow
              resourceCollection={resourceCollection}
              collectionResources={slideshowResources}
              pagination={slideshowResourcesMeta.pagination}
              dispatch={dispatch}
            />
            <h2 id={listHeaderId} className="screen-reader-text">
              {t("pages.subheaders.resource_list")}
            </h2>
            <EntityListTotal
              linkTo={lh.link(
                "frontendProjectResources",
                project.attributes.slug
              )}
              entityName={t("glossary.resource_one", { count: totalCount })}
              count={totalCount}
            />
          </div>
        )
      }
      BodyComponent={props => (
        <ResourceList.Cards
          resourceCollection={resourceCollection}
          project={project}
          resources={resources}
          itemHeadingLevel={3}
          {...props}
        />
      )}
      filterProps={filterProps}
      countProps={
        isEmpty(meta)
          ? {}
          : {
              pagination: get(meta, "pagination"),
              unit: t("glossary.resource", {
                count: meta?.pagination?.totalCount
              })
            }
      }
      paginationProps={
        !showPagination
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
  "Frontend.Composed.EntityCollection.ProjectResourceCollectionDetail";

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
