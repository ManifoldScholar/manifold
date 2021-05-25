import React from "react";
import PropTypes from "prop-types";
import Resourceish from "frontend/components/resourceish";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Template from "../Template";
import DeferredCollectable from "../DeferredCollectable";

function CollectedResources({ collectedIds, responses, nested }) {
  if (collectedIds.length < 1) return null;

  return (
    <Template title="Resources" icon="resources64" nested={nested}>
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
    </Template>
  );
}

CollectedResources.displayName = "ReadingGroup.Collecting.CollectedResources";

CollectedResources.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  nested: PropTypes.bool
};

export default CollectedResources;
