import React from "react";
import PropTypes from "prop-types";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";
import DeferredCollectable from "frontend/components/collecting/reading-group/static/DeferredCollectable";
import Resourceish from "frontend/components/resourceish";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

function CollectedResources({ collectedIds, responses }) {
  if (collectedIds.length < 1) return null;

  return (
    <CollectionBlock title="Resources" icon="resources64" nested>
      <div className="resource-thumbnail-list">
        <ul>
          {collectedIds.map(id => (
            <li key={id}>
              <DeferredCollectable
                id={id}
                type="resources"
                responses={responses}
              >
                {response => {
                  const { projectSlug } = response.attributes;
                  return (
                    <Link
                      to={lh.link(
                        "frontendProjectResource",
                        projectSlug,
                        response.attributes.slug
                      )}
                      className="resource-link"
                    >
                      <Resourceish.Thumbnail resourceish={response} showTitle />
                    </Link>
                  );
                }}
              </DeferredCollectable>
            </li>
          ))}
        </ul>
      </div>
    </CollectionBlock>
  );
}

CollectedResources.displayName = "ReadingGroup.Collecting.CollectedResources";

CollectedResources.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired
};

export default CollectedResources;
