import React from "react";
import PropTypes from "prop-types";
import pluralize from "pluralize";

function Index({ count, unit, categoryCount, uncategorized = 0 }) {
  if (categoryCount) {
    const categorized = count - uncategorized;
    if (!categorized) {
      return (
        <>
          There {pluralize("is", categoryCount)}{" "}
          <strong>{categoryCount}</strong> empty{" "}
          {pluralize("volume", categoryCount)}
          {!!uncategorized && (
            <>
              {" "}
              and <strong>{uncategorized}</strong> additional{" "}
              {pluralize("issue", uncategorized)}
            </>
          )}
        </>
      );
    }
    return (
      <>
        There {pluralize("is", categorized)} <strong>{categorized}</strong>{" "}
        {pluralize(unit, categorized)}
        {" in "}
        <strong>{categoryCount}</strong> {pluralize("volume", categoryCount)}
        {!!uncategorized && (
          <>
            {" "}
            and <strong>{uncategorized}</strong> additional{" "}
            {pluralize("issue", uncategorized)}
          </>
        )}
      </>
    );
  }
  return (
    <>
      There {pluralize("is", count)} <strong>{count}</strong>{" "}
      {pluralize(unit, count)}
    </>
  );
}

Index.displayName = "Journal.IssueList.CountTemplate";

Index.propTypes = {
  count: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  categoryCount: PropTypes.number,
  uncategorized: PropTypes.number
};

export default Index;
