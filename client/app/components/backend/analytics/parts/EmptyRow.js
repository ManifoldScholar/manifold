import React from "react";
import PropTypes from "prop-types";

function EmptyRow({ message }) {
  return (
    <tr className="analytics-table__row">
      <td className="analytics-table__empty-message">{message}</td>
      <td>{""}</td>
    </tr>
  );
}

EmptyRow.propTypes = {
  message: PropTypes.string.isRequired
};

EmptyRow.displayName = "Analytics.Block.Table.Row";

export default EmptyRow;
