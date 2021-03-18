import React from "react";
import PropTypes from "prop-types";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "./collection-blocks";

function CollectionCategory({ title, description, mappings, responses }) {
  function getCollectedIdsByType(type) {
    if (!mappings || !mappings[type]) return [];
    return mappings[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type];
  }

  return (
    <article className="container group-collection-category">
      <header className="group-collection-category__header">
        <h2 className="group-collection-category__heading">
          {title.plaintext}
        </h2>
        {description && (
          <div
            dangerouslySetInnerHTML={{ __html: description.formatted }}
            className="group-collection-category__description"
          />
        )}
      </header>
      <div className="group-collection-category__body">
        <CollectedProjects
          collectedIds={getCollectedIdsByType("projects")}
          responses={getResponsesByType("projects")}
        />
        <CollectedTexts
          collectedIds={getCollectedIdsByType("texts")}
          responses={getResponsesByType("texts")}
        />
        <CollectedTextSections
          collectedIds={getCollectedIdsByType("textSections")}
          responses={getResponsesByType("textSections")}
        />
        <CollectedResourceCollections
          collectedIds={getCollectedIdsByType("resourceCollections")}
          responses={getResponsesByType("resourceCollections")}
        />
        <CollectedResources
          collectedIds={getCollectedIdsByType("resources")}
          responses={getResponsesByType("resources")}
        />
      </div>
    </article>
  );
}

CollectionCategory.displayName = "ReadingGroup.Collecting.CollectionCategory";

CollectionCategory.propTypes = {
  title: PropTypes.shape({
    plaintext: PropTypes.string.isRequired
  }).isRequired,
  description: PropTypes.shape({
    formatted: PropTypes.node.isRequired
  }),
  mappings: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired
};

export default CollectionCategory;
