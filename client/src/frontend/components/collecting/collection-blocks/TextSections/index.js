import React from "react";
import PropTypes from "prop-types";
import TOCNode from "frontend/components/content-block/Block/types/TOC/Node";
import Template from "../Template";
import DeferredCollectable from "../DeferredCollectable";

function CollectedTextSections({ collectedIds, responses, nested }) {
  if (collectedIds.length < 1) return null;

  return (
    <Template title="Text Sections" icon="toc64" nested={nested}>
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
    </Template>
  );
}

CollectedTextSections.displayName =
  "ReadingGroup.Collecting.CollectedTextSections";

CollectedTextSections.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  nested: PropTypes.bool
};

export default CollectedTextSections;
