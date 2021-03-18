import React from "react";
import PropTypes from "prop-types";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";
import DeferredCollectable from "frontend/components/collecting/reading-group/static/DeferredCollectable";
import GridItem from "frontend/components/project-list/GridItem";

function CollectedProjects({ collectedIds, responses }) {
  if (collectedIds.length < 1) return null;

  return (
    <CollectionBlock title="Projects" icon="projects64" nested>
      <div className="project-list grid entity-section-wrapper__body group-collection-category__bottom-margin-offset">
        <ul>
          {collectedIds.map(id => (
            <li key={id} className="project-list__item--pos-rel">
              <DeferredCollectable
                id={id}
                type="projects"
                responses={responses}
              >
                {response => {
                  return (
                    <GridItem
                      authenticated={false}
                      project={response}
                      hideCollectingToggle
                    />
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

CollectedProjects.displayName = "ReadingGroup.Collecting.CollectedProjects";

CollectedProjects.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired
};

export default CollectedProjects;
