import React from "react";
import PropTypes from "prop-types";
import EntityCollection from "frontend/components/entity/Collection/EntityCollection";
import AllLink from "frontend/components/event/AllLink";
import Authorization from "helpers/authorization";
import contentBlockHelpers from "helpers/contentBlockHelpers";
import types from "../types";
import { Warning } from "../parts";
import * as Styled from "./styles";

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

function getTitle(block, typeComponent, hideDefaultHeader) {
  const {
    attributes: { title, renderable }
  } = block;
  if (!renderable) return typeComponent.placeholderTitle || typeComponent.title;
  if (title) return title;
  return hideDefaultHeader ? undefined : typeComponent.title;
}

function getIcon(block, typeComponent, isJournalIssue) {
  if (block.type === "textsBlocks" && isJournalIssue) return "journals64";
  return block?.attributes?.icon ?? typeComponent.icon;
}

function UtilityComponent({ block, entity }) {
  if (block.type !== "recentActivityBlocks") return null;
  return <AllLink entity={entity} threshold={6} />;
}

function ContentBlock({
  block,
  entity,
  hideHeader,
  hideDefaultHeader,
  hideBottomBorder,
  ...passThroughProps
}) {
  const authorization = new Authorization();
  const typeComponent = typeToBlockComponent(block.attributes.type);
  const entityIsJournalIssue =
    entity.attributes.isJournalIssue || entity.type === "journalIssues";

  if (!showBlock(block, authorization)) return null;

  const {
    attributes: { descriptionFormatted, style }
  } = block;

  const headerProps = hideHeader
    ? {}
    : {
        title: getTitle(block, typeComponent, hideDefaultHeader),
        icon: getIcon(block, typeComponent, entityIsJournalIssue),
        description: descriptionFormatted
      };

  const TypeComponent = typeComponent;

  return (
    <EntityCollection
      {...headerProps}
      UtilityComponent={() => (
        <UtilityComponent block={block} entity={entity} />
      )}
      BodyComponent={() => (
        <Styled.BodyWrapper $hideBottomBorder={hideBottomBorder}>
          {block.attributes.renderable ? (
            <TypeComponent block={block} entity={entity} />
          ) : (
            <Warning.Incomplete block={block} />
          )}
        </Styled.BodyWrapper>
      )}
      bgColor={style === "shaded" ? "neutral05" : "white"}
      {...passThroughProps}
    />
  );
}

ContentBlock.displayName = "ContentBlock";

ContentBlock.propTypes = {
  block: PropTypes.object.isRequired,
  entity: PropTypes.object.isRequired,
  hideHeader: PropTypes.bool,
  hideDefaultHeader: PropTypes.bool,
  hideBottomBorder: PropTypes.bool
};

export default ContentBlock;
