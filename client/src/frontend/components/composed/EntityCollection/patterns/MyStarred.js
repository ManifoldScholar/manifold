import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import IconComposer from "global/components/utility/IconComposer";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "frontend/components/collecting/collection-blocks";
import { collectedIdsForCollection } from "frontend/components/collecting/helpers";
import EntityCollection from "../EntityCollection";

function MyStarredEntityCollection({
  collection,
  responses,
  onUncollect,
  ...passThroughProps
}) {
  const mapping = collection.attributes?.categoryMappings.$uncategorized$;
  const hasCollecteds = !isEmpty(mapping);
  const collectedIds = collectedIdsForCollection(collection);
  const totalCount = collectedIds.length;

  function getCollectedIdsByType(type) {
    if (!mapping || !mapping[type]) return [];
    return mapping[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type] || [];
  }

  function getCollectedProps(type) {
    return {
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onUncollect: () => onUncollect(type),
      boxed: true
    };
  }

  return (
    <EntityCollection
      title="My Starred"
      IconComponent={() => (
        <IconComposer
          size={48}
          icon="StarFillUnique"
          className="icon-star-fill--header"
        />
      )}
      countProps={{
        count: totalCount,
        unit: "item",
        customTemplate: (count, unit) => (
          <span>
            You have starred <strong>{count}</strong> {unit}
          </span>
        )
      }}
      BodyComponent={() =>
        hasCollecteds ? (
          <>
            <CollectedProjects {...getCollectedProps("projects")} />
            <CollectedTexts {...getCollectedProps("texts")} />
            <CollectedTextSections {...getCollectedProps("textSections")} />
            <CollectedResourceCollections
              {...getCollectedProps("resourceCollections")}
            />
            <CollectedResources {...getCollectedProps("resources")} />
          </>
        ) : (
          <EntityCollectionPlaceholder.MyStarred />
        )
      }
      {...passThroughProps}
    />
  );
}

MyStarredEntityCollection.displayName =
  "Frontend.Composed.EntityCollection.MyStarred";

MyStarredEntityCollection.propTypes = {
  collection: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  onUncollect: PropTypes.func.isRequired
};

export default MyStarredEntityCollection;
