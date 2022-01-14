import React from "react";
import PropTypes from "prop-types";
import EntityCollection from "frontend/components/composed/EntityCollection/EntityCollection";
import AllLink from "frontend/components/event/AllLink";
import Authorization from "helpers/authorization";
import contentBlockHelpers from "helpers/contentBlockHelpers";
import types from "./types";
import { Warning } from "./parts";

function typeToBlockComponent(type) {
  return contentBlockHelpers.typeToComponent(type, types);
}

function canUpdate(block, authorization) {
  return authorization.authorizeAbility({
    entity: block,
    ability: "update"
  });
}

function showBlock(block, authorization) {
  const {
    attributes: { renderable, visible }
  } = block;
  if (renderable) return true;
  if (!canUpdate(block, authorization)) return false;
  return visible;
}

function getTitle(block, typeComponent) {
  const {
    attributes: { title, renderable }
  } = block;

  if (!renderable) return typeComponent.placeholderTitle || typeComponent.title;

  return title || typeComponent.title;
}

function getIcon(block, typeComponent) {
  return block?.attributes?.icon ?? typeComponent.icon;
}

function UtilityComponent({ block, entity }) {
  if (block.type !== "recentActivityBlocks") return null;
  return <AllLink entity={entity} threshold={6} />;
}

function ContentBlock({ block, entity, hideHeader, ...passThroughProps }) {
  const authorization = new Authorization();
  const typeComponent = typeToBlockComponent(block.attributes.type);

  if (!showBlock(block, authorization)) return null;

  const {
    attributes: { descriptionFormatted, style }
  } = block;

  const headerProps = hideHeader
    ? {}
    : {
        title: getTitle(block, typeComponent),
        icon: getIcon(block, typeComponent),
        description: descriptionFormatted
      };

  const TypeComponent = typeComponent;

  return (
    <EntityCollection
      {...headerProps}
      UtilityComponent={() => (
        <UtilityComponent block={block} entity={entity} />
      )}
      BodyComponent={() =>
        block.attributes.renderable ? (
          <TypeComponent block={block} entity={entity} />
        ) : (
          <Warning.Incomplete block={block} />
        )
      }
      bgColor={style === "shaded" ? "neutral05" : "white"}
      {...passThroughProps}
    />
  );
}

ContentBlock.displayName = "ContentBlock";

ContentBlock.propTypes = {
  block: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired
};

export default ContentBlock;
