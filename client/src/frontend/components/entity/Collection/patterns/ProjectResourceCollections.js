import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import ResourceCollectionListGrid from "frontend/components/resource-collection-list/Grid";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function ProjectResourceCollectionsEntityCollection({
  resourceCollections,
  resourceCollectionsMeta,
  filterProps,
  paginationProps,
  itemHeadingLevel,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  return (
    <EntityCollection
      title={t("pages.resource_collections_all")}
      icon="resourceCollection64"
      BodyComponent={props => (
        <ResourceCollectionListGrid
          resourceCollections={resourceCollections}
          itemHeadingLevel={itemHeadingLevel}
          {...props}
        />
      )}
      countProps={
        !resourceCollectionsMeta
          ? {}
          : {
              pagination: get(resourceCollectionsMeta, "pagination"),
              unit: t("glossary.resource_collection", {
                count: resourceCollectionsMeta?.pagination?.totalCount || 0
              })
            }
      }
      paginationProps={
        isEmpty(resourceCollectionsMeta)
          ? {}
          : {
              pagination: get(resourceCollectionsMeta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

ProjectResourceCollectionsEntityCollection.displayName =
  "Frontend.Entity.Collection.ProjectsResourceCollections";

ProjectResourceCollectionsEntityCollection.propTypes = {
  resourceCollections: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceCollectionsMeta: PropTypes.object,
  paginationProps: shapes.pagination,
  itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
};

export default ProjectResourceCollectionsEntityCollection;
