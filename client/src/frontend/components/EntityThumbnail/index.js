import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import { EntityAvatar, PlaceholderAvatar } from "./avatar";
import EntityMetadata from "frontend/components/EntityThumbnail/EntityMetadata";
import lh from "helpers/linkHandler";
import * as Styled from "./EntityThumbnail.styles";

export default function EntityThumbnail({
  entity,
  onUncollect,
  hideMeta = false,
  hideDescription = true,
  hideDate = false,
  userMock = false
}) {
  const placeholder = !entity.attributes.avatarStyles.original;

  return (
    <>
      <Styled.ItemLink
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
    </>
  );
}

EntityThumbnail.propTypes = {
  entity: PropTypes.object.isRequired,
  onUncollect: PropTypes.func,
  hideMeta: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideDescription: PropTypes.bool,
  /* For stories */
  userMock: PropTypes.object
};
