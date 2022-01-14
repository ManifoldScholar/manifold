import React from "react";
import PropTypes from "prop-types";
import pluralize from "pluralize";

function CountTemplate({ count, unit, categoryCount }) {
  if (categoryCount)
    return (
      <>
        There are <strong>{count}</strong> {unit}
        {" in "}
        <strong>{categoryCount}</strong> {pluralize("volume", categoryCount)}
      </>
    );
  return (
    <>
      There are <strong>{count}</strong> {unit}
    </>
  );
}

CountTemplate.displayName = "Journal.IssueList.CountTemplate";

CountTemplate.propTypes = {
  count: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  categoryCount: PropTypes.number
};

export default CountTemplate;
