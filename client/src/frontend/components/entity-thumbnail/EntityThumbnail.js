import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import EntityAvatar from "./EntityAvatar";
import EntityMetadata from "./EntityMetadata";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import * as Styled from "./EntityThumbnail.styles";

export default function EntityThumbnail({
  entity,
  onUncollect,
  hideMeta = false,
  hideDesc = false,
  hideDate = false,
  userMock = false
}) {
  const placeholder = !entity.attributes.avatarStyles.original;

  return (
    <>
      <Link
        /* Don't leave this in. Needs global resets for link styles */
        style={{ textDecoration: "none" }}
        to={lh.link("frontendProjectDetail", entity.attributes.slug)}
      >
        <Styled.Cover placeholder={placeholder}>
          <EntityAvatar entity={entity} />
        </Styled.Cover>
        {!hideMeta && (
          <EntityMetadata
            entity={entity}
            hideDescription={hideDesc}
            hideDate={hideDate}
          />
        )}
      </Link>
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
  entity: PropTypes.object,
  onUncollect: PropTypes.func,
  hideMeta: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideDesc: PropTypes.bool,
  /* For stories */
  userMock: PropTypes.object
};
