import React from "react";
import PropTypes from "prop-types";
import HeadContent from "global/components/HeadContent";
import { useEntityHeadContent } from "./helpers";

function EntityHeadContent({ entity, parentEntity, titlePrepend }) {
  const { title, description, image } = useEntityHeadContent(
    entity,
    parentEntity,
    titlePrepend
  );
  return <HeadContent title={title} description={description} image={image} />;
}

EntityHeadContent.displayName = "Frontend.Entity.HeadContent";

EntityHeadContent.propTypes = {
  entity: PropTypes.object.isRequired,
  parentEntity: PropTypes.object,
  titlePrepend: PropTypes.string
};

export default EntityHeadContent;
