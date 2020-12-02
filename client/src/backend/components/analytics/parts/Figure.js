import React from "react";
import PropTypes from "prop-types";

function Figure({ stat, caption }) {
  return (
    <figure>
      <div className="analytics-block__stat">{stat}</div>
      <figcaption className="analytics-block__caption">{caption}</figcaption>
    </figure>
  );
}

Figure.propTypes = {
  stat: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired
};

Figure.displayName = "Analytics.Block.Figure";

export default Figure;
