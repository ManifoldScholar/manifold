import React from "react";
import PropTypes from "prop-types";

function Figure({ stat, caption }) {
  return stat ? (
    <figure>
      <div className="analytics-block__stat">{stat}</div>
      <figcaption className="analytics-block__caption">{caption}</figcaption>
    </figure>
  ) : null;
}

Figure.propTypes = {
  stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  caption: PropTypes.string.isRequired
};

Figure.displayName = "Analytics.Block.Figure";

export default Figure;
