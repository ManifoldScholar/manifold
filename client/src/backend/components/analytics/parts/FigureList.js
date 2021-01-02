import React from "react";
import PropTypes from "prop-types";
import Figure from "./Figure";

function FigureList({ figures }) {
  return (
    <ul className="analytics-block__figure-list">
      {/* eslint-disable react/no-array-index-key */}
      {figures.map((figure, index) => (
        <li key={index} className="analytics-block__figure-list-item">
          <Figure key={index} {...figure} />
        </li>
      ))}
      {/* eslint-enable react/no-array-index-key */}
    </ul>
  );
}

FigureList.propTypes = {
  figures: PropTypes.arrayOf(
    PropTypes.shape({
      stat: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      caption: PropTypes.string.isRequired
    })
  )
};

FigureList.displayName = "Analytics.Block.FigureList";

export default FigureList;
