import React from "react";
import PropTypes from "prop-types";
import ResourceCollection from "frontend/components/resource-collection";
import lh from "helpers/linkHandler";
import Template from "../Template";
import DeferredCollectable from "../DeferredCollectable";

function CollectedResourceCollections({ collectedIds, responses, nested }) {
  if (collectedIds.length < 1) return null;

  return (
    <Template
      title="Resource Collections"
      icon="resourceCollection64"
      nested={nested}
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
    </Template>
  );
}

CollectedResourceCollections.displayName =
  "ReadingGroup.Collecting.CollectedResourceCollections";

CollectedResourceCollections.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  nested: PropTypes.bool
};

export default CollectedResourceCollections;
