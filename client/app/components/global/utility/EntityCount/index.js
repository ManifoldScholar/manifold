import React from "react";
import PropTypes from "prop-types";
import isFunction from "lodash/isFunction";
import Range from "./Range";
import * as Styled from "./styles";

function EntityCount({ pagination, count, unit, customTemplate }) {
  if (isFunction(customTemplate))
    return <Styled.Total>{customTemplate(count, unit)}</Styled.Total>;

  if (pagination) return <Range pagination={pagination} unit={unit} />;

  return (
    <Styled.Total>
      <Styled.Highlighted>{count}</Styled.Highlighted>
      {unit}
    </Styled.Total>
  );
}

EntityCount.displayName = "Global.Utility.EntityCount";

EntityCount.propTypes = {
  pagination: PropTypes.shape({
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired
  }),
  count: PropTypes.number,
  unit: PropTypes.string.isRequired,
  customTemplate: PropTypes.func
};

export default EntityCount;
