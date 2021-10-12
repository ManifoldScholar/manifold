import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import { EntityAvatar, PlaceholderAvatar } from "./avatar";
import EntityMetadata from "./EntityMetadata";
import lh from "helpers/linkHandler";
import * as Styled from "./EntityThumbnail.styles";

export default function EntityThumbnail({
  entity,
  onUncollect,
  hideMeta = false,
  hideDescription = true,
  hideDate = false,
  userMock = false,
  stack = true
}) {
  const placeholder = !entity.attributes.avatarStyles.original;

  return (
    <div>
      <Styled.ItemLink
        stack={stack}
        to={lh.link("frontendProjectDetail", entity.attributes.slug)}
      >
        <Styled.Cover>
          {placeholder ? (
            <PlaceholderAvatar entity={entity} />
          ) : (
            <EntityAvatar entity={entity} />
          )}
        </Styled.Cover>
        {!hideMeta && (
          <EntityMetadata
            entity={entity}
            hideDescription={hideDescription}
            hideDate={hideDate}
            stack={stack}
          />
        )}
      </Styled.ItemLink>
      <Collecting.Toggle
        collectable={entity}
        onUncollect={onUncollect}
        inline={false}
        outlined={false}
        userMock={userMock}
      />
    </div>
  );
}

EntityThumbnail.propTypes = {
  entity: PropTypes.object.isRequired,
  onUncollect: PropTypes.func,
  hideMeta: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideDescription: PropTypes.bool,
  stack: PropTypes.bool,
  /* For stories */
  userMock: PropTypes.object
};
