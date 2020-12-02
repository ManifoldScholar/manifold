import React from "react";
import PropTypes from "prop-types";

function SearchRow({ keyword, count }) {
  return (
    <tr className="analytics-table__row">
      <td>{keyword}</td>
      <td>{`${count}`}</td>
    </tr>
  );
}

SearchRow.propTypes = {
  keyword: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired
};

SearchRow.generateId = search => search.keyword;

SearchRow.displayName = "Analytics.Block.Table.SearchRow";

export default SearchRow;
