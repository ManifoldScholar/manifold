import React from "react";
import PropTypes from "prop-types";

function Figure({ stat, caption }) {
  const canRender =
    (typeof stat === "number" && !isNaN(stat)) || typeof stat === "string";

  return canRender ? (
    <figure>
      <div className="analytics-block__stat">{stat}</div>
      <figcaption className="analytics-block__caption">{caption}</figcaption>
    </figure>
  ) : null;
}

Figure.propTypes = {
  stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  caption: PropTypes.string.isRequired,
};

Figure.displayName = "Analytics.Block.Figure";

export default Figure;
