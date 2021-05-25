import React from "react";
import PropTypes from "prop-types";
import {
  Heading,
  Wrapper
} from "frontend/components/content-block/Block/parts";

function CollectionBlockTemplate({ id, title, icon, children, nested }) {
  return (
    <Wrapper id={id} theme={nested ? "nested" : "box"} nested={nested}>
      <Heading title={title} icon={icon} />
      <div className="entity-section-wrapper__body">{children}</div>
    </Wrapper>
  );
}

CollectionBlockTemplate.displayName = "Collecting.CollectionBlockTemplate";

CollectionBlockTemplate.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node,
  nested: PropTypes.bool
};

export default CollectionBlockTemplate;
