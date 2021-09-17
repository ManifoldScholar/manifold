import * as React from "react";
import Utility from "global/components/utility";
import PropTypes from "prop-types";

const BlockHeaderDetail = ({ titleId, title, hasDescription, description }) => {
  return (
    <>
      <div className="hero-builder-block__header-details">
        <h3 id={titleId} className="hero-builder-block__title">
          {title}
        </h3>
        {hasDescription && (
          <p className="hero-builder-block__description">{description}</p>
        )}
      </div>
      <div className="hero-builder-block__button">
        <span className="hero-builder-block__button-label">Edit</span>
        <Utility.IconComposer icon="annotate32" size={26} />
      </div>
    </>
  );
};

BlockHeaderDetail.propTypes = {
  title: PropTypes.string.isRequired,
  titleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  hasDescription: PropTypes.bool
};

export default BlockHeaderDetail;
