import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import EntityAvatar from "global/components/atomic/EntityAvatar";
import EntityMetadata from "./EntityMetadata";
import lh from "helpers/linkHandler";
import * as Styled from "./styles";

export default function EntityThumbnail({
  entity,
  onUncollect,
  hideMeta = false,
  hideDescription = true,
  hideDate = false,
  stack = true,
  parentView = false
}) {
  const urlParam =
    entity.type === "journalIssues"
      ? entity.attributes.projectSlug
      : entity.attributes.slug;
  return (
    <Styled.Wrapper>
      <Styled.ItemLink
        $stack={stack}
        to={lh.link("frontendProjectDetail", urlParam)}
      >
        <Styled.Cover $stack={stack}>
          <EntityAvatar entity={entity} />
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
      <Collecting.Toggle
        collectable={entity}
        onUncollect={onUncollect}
        inline={false}
        outlined={false}
      />
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
  stack: PropTypes.bool
};
