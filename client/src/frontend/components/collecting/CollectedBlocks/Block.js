import React from "react";
import PropTypes from "prop-types";
import {
  Heading,
  Wrapper
} from "frontend/components/content-block/Block/parts";

function CollectedBlock({ id, title, icon, children }) {
  return (
    <Wrapper id={id} theme="box">
      <Heading title={title} icon={icon} />
      <div className="entity-section-wrapper__body">{children}</div>
    </Wrapper>
  );
}

CollectedBlock.displayName = "Collecting.CollectedBlocks.Block";

CollectedBlock.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default CollectedBlock;
