import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import EntityAvatar from "global/components/atomic/EntityAvatar";
import EntityMetadata from "./EntityMetadata";
import * as Styled from "./styles";
import ProjectCollectionAvatar from "../EntityAvatar/patterns/ProjectCollectionAvatar";

export default function EntityThumbnail({
  entity,
  onUncollect,
  hideMeta = false,
  hideDescription = true,
  hideDate = false,
  stack = true,
  parentView = false,
  isListItem = false
}) {
  const getUrl = () => {
    if (entity.type === "journals") {
      return `/journals/${entity.attributes.slug}`;
    } else if (entity.type === "projectCollections") {
      return `/project-collections/${entity.attributes.slug}`;
    } else if (entity.type === "journalIssues") {
      return `/projects/${entity.attributes.projectSlug}`;
    } else {
      return `/projects/${entity.attributes.slug}`;
    }
  };

  const as = isListItem ? "li" : "div";

  return (
    <Styled.Wrapper as={as}>
      <Styled.ItemLink $stack={stack} to={getUrl()}>
        <Styled.Cover $stack={stack}>
          {entity.type === "projectCollections" ? (
            <ProjectCollectionAvatar entity={entity} />
          ) : (
            <EntityAvatar entity={entity} />
          )}
        </Styled.Cover>
        {!hideMeta && (
          <EntityMetadata.Wrapper
            entity={entity}
            hideDescription={hideDescription}
            hideDate={hideDate}
            stack={stack}
            parentView={parentView}
          />
        )}
      </Styled.ItemLink>
      {entity.type !== "projectCollections" && (
        <Collecting.Toggle
          collectable={entity}
          onUncollect={onUncollect}
          inline={false}
          outlined={false}
        />
      )}
    </Styled.Wrapper>
  );
}

EntityThumbnail.displayName = "Global.Atomic.EntityThumbnail";

EntityThumbnail.propTypes = {
  entity: PropTypes.object.isRequired,
  onUncollect: PropTypes.func,
  hideMeta: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideDescription: PropTypes.bool,
  stack: PropTypes.bool,
  isListItem: PropTypes.bool
};
