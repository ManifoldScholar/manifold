import React from "react";
import PropTypes from "prop-types";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";
import DeferredCollectable from "frontend/components/collecting/reading-group/static/DeferredCollectable";
import TOCNode from "frontend/components/content-block/Block/types/TOC/Node";

function CollectedTextSections({ collectedIds, responses }) {
  if (collectedIds.length < 1) return null;

  return (
    <CollectionBlock title="Text Sections" icon="toc64" nested>
      <div className="toc-block">
        <ul className="toc-block__list toc-block__list--depth-1 toc-block__list--large">
          {collectedIds.map(id => (
            <DeferredCollectable
              key={id}
              id={id}
              type="textSections"
              responses={responses}
            >
              {response => {
                const {
                  id: nodeId,
                  attributes: { name, textSlug, textTitle }
                } = response;
                return (
                  <TOCNode
                    id={nodeId}
                    title={name}
                    textSlug={textSlug}
                    textTitle={textTitle}
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

CollectedTextSections.displayName =
  "ReadingGroup.Collecting.CollectedTextSections";

CollectedTextSections.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired
};

export default CollectedTextSections;
