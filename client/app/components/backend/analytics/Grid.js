import React from "react";
import PropTypes from "prop-types";

function Grid({ columns = 4, children }) {
  return (
    <div className={`analytics-grid analytics-grid--${columns}-col`}>
      {children}
    </div>
  );
}

Grid.propTypes = {
  columns: PropTypes.oneOf([2, 3, 4]),
  children: PropTypes.node
};

Grid.displayName = "Analytics.Grid";

export default Grid;
