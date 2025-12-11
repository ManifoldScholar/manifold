import React from "react";
import PropTypes from "prop-types";

function Row({ label, value }) {
  return (
    <tr className="analytics-table__row">
      <td>{label}</td>
      <td>{`${value}`}</td>
    </tr>
  );
}

Row.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
};

Row.displayName = "Analytics.Block.Table.Row";

export default Row;
