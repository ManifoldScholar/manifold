import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import ResourceCollectionList from "frontend/components/resource-collection-list";
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
  const showPagination =
    !isEmpty(resourceCollectionsMeta) && !isEmpty(paginationProps);
  return (
    <EntityCollection
      title="All Project Resource Collections"
      icon="resourceCollection64"
      BodyComponent={props => (
        <ResourceCollectionList.Grid
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
              singularUnit: "resource collection",
              pluralUnit: "resource collections"
            }
      }
      paginationProps={
        !showPagination
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
  "Global.Composed.EntityCollection.ProjectsResourceCollections";

ProjectResourceCollectionsEntityCollection.propTypes = {
  resourceCollections: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceCollectionsMeta: PropTypes.object,
  paginationProps: shapes.pagination,
  itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6])
};

export default ProjectResourceCollectionsEntityCollection;
