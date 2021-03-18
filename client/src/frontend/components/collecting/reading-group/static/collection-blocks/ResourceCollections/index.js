import React from "react";
import PropTypes from "prop-types";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";
import DeferredCollectable from "frontend/components/collecting/reading-group/static/DeferredCollectable";
import ResourceCollection from "frontend/components/resource-collection";
import lh from "helpers/linkHandler";

function CollectedResourceCollections({ collectedIds, responses }) {
  if (collectedIds.length < 1) return null;

  return (
    <CollectionBlock
      title="Resource Collections"
      icon="resourceCollection64"
      nested
    >
      <div className="resource-collections-list">
        <ul>
          {collectedIds.map(id => (
            <DeferredCollectable
              key={id}
              id={id}
              type="resourceCollections"
              responses={responses}
            >
              {response => {
                const urlCreator = collection => {
                  return lh.link(
                    "frontendProjectResourceCollection",
                    collection.attributes.projectSlug,
                    collection.attributes.slug
                  );
                };

                return (
                  <ResourceCollection.Cover
                    urlCreator={urlCreator}
                    resourceCollection={response}
                  />
                );
              }}
            </DeferredCollectable>
          ))}
        </ul>
      </div>
    </CollectionBlock>
  );
}

CollectedResourceCollections.displayName =
  "ReadingGroup.Collecting.CollectedResourceCollections";

CollectedResourceCollections.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired
};

export default CollectedResourceCollections;
