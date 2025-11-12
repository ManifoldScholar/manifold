import React from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";
import {
  getHeroImage,
  getHeaderLayout
} from "frontend/components/entity/Collection/helpers";

const ProjectCollectionAvatar = ({ entity }) => {
  const headerLayout = getHeaderLayout(entity);
  const src = getHeroImage(headerLayout, entity);
  const alt = entity.attributes.heroAltText;
  const width = 320;
  const height = 320;
  // const icon = entity.attributes.icon;

  return src ? (
    <Styled.Avatar
      src={src}
      alt={alt ?? ""}
      width={width}
      height={height}
      loading="lazy"
    />
  ) : (
    <Styled.Placeholder mode="responsive" color={"primary"} ariaLabel={false} />
  );
};

ProjectCollectionAvatar.displayName =
  "Global.Atomic.EntityAvatar.ProjectCollection";

ProjectCollectionAvatar.propTypes = {
  entity: PropTypes.object,
  stack: PropTypes.bool
};

export default ProjectCollectionAvatar;
