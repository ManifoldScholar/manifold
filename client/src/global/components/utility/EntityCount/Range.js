import React from "react";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import * as Styled from "./styles";

function getRangeValues(pagination) {
  const { perPage, currentPage, totalCount } = pagination;
  let start = perPage * (currentPage - 1);
  if (totalCount > 0) start += 1;
  let end = totalCount < perPage ? totalCount : perPage * currentPage;
  if (end > totalCount) end = totalCount;

  return { start, end, totalCount };
}

function Range({ pagination, unit }) {
  const { start, end, totalCount } = getRangeValues(pagination);
  return (
    <Styled.Total role="status">
      <span aria-hidden>
        {"Showing "}
        <Styled.Highlighted>{`${start}-${end}`}</Styled.Highlighted>
        {" of "}
        <Styled.Highlighted>{totalCount}</Styled.Highlighted>
        {` ${pluralize(unit, totalCount)}:`}
      </span>
      <span className="screen-reader-text">
        {`${totalCount} ${pluralize(
          unit,
          totalCount
        )}. Showing results ${start} through ${end}.`}
      </span>
    </Styled.Total>
  );
}

Range.displayName = "Global.Utility.EntityCount.Range";

Range.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired
  }).isRequired,
  unit: PropTypes.string.isRequired
};

export default Range;
