import React from "react";
import PropTypes from "prop-types";
import ContentBlock from "frontend/components/content-block/Block";

export default function ContentBlockList({ entity, blocks, ...props }) {
  const byAccess = (block, project) => {
    const authorized = project.attributes.abilities.fullyRead;
    const { access } = block.attributes;
    if (access === "always") return true;
    if (authorized) return access === "authorized";
    if (!authorized) return access === "unauthorized";
    return false;
  };

  if (blocks) {
    return blocks
      .filter(block => block.attributes?.visible)
      .filter(block => byAccess(block, block.relationships.project))
      .map(block => {
        return (
          <ContentBlock
            key={block.id}
            block={block}
            entity={block.relationships.project}
            {...props}
          />
        );
      });
  }

  return entity.relationships.contentBlocks
    .filter(block => block.attributes?.visible)
    .filter(block => byAccess(block, entity))
    .map(block => (
      <ContentBlock key={block.id} block={block} entity={entity} {...props} />
    ));
}

ContentBlockList.displayName = "Frontend.ContentBlockList";

ContentBlockList.propTypes = {
  entity: PropTypes.object,
  blocks: PropTypes.array
};
