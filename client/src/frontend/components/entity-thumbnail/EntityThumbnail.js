import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import EntityAvatar from "./EntityAvatar";
import EntityMetadata from "./EntityMetadata";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default function EntityThumbnail({
  entity,
  onUncollect,
  hideMeta = false,
  hideDesc = false,
  hideDate = false,
  user
}) {
  const figureClass = classNames("cover", {
    "cover-placeholder": !entity.attributes.avatarStyles.small,
    dim: entity.attributes.draft
  });

  return (
    <div className="project-list li item-wrapper">
      <Link to={lh.link("frontendProjectDetail", entity.attributes.slug)}>
        <figure className={figureClass}>
          <EntityAvatar entity={entity} />
        </figure>
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
        currentUser={user}
      />
    </div>
  );
}

EntityThumbnail.propTypes = {
  entity: PropTypes.object,
  onUncollect: PropTypes.func,
  hideMeta: PropTypes.bool,
  hideDate: PropTypes.bool,
  hideDesc: PropTypes.bool,
  user: PropTypes.object
};
