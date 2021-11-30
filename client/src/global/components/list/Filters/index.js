import React, { useRef } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Search from "./Search";
import Filter, { filterShape } from "./Filter";
import * as Styled from "./styles";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

function Filters({
  searchProps,
  filters,
  onSubmit,
  onReset,
  showResetButton,
  setScreenReaderStatus,
  className
}) {
  const searchInput = useRef(null);

  function handleReset() {
    onReset();
    setScreenReaderStatus("Search and filters reset.");
    if (searchInput.current) searchInput.current.focus();
  }

  return (
    <Styled.Wrapper
      as={onSubmit ? "form" : "div"}
      onSubmit={onSubmit}
      $count={filters.length}
      $searchCount={!isEmpty(searchProps) ? 1 : 0}
      className={className}
    >
      {!isEmpty(searchProps) && (
        <Search inputRef={searchInput} {...searchProps} />
      )}
      <Styled.SelectGroup $count={filters.length}>
        {filters.map(filter => (
          <Filter key={filter.label} {...filter} />
        ))}
      </Styled.SelectGroup>
      {showResetButton && (
        <Styled.ResetButton type="reset" onClick={handleReset}>
          {"Reset Search + Filters"}
        </Styled.ResetButton>
      )}
    </Styled.Wrapper>
  );
}

Filters.displayName = "Global.List.Filters";

Filters.propTypes = {
  searchProps: PropTypes.shape({
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }),
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      ...filterShape
    }).isRequired
  ),
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  showResetButton: PropTypes.bool,
  setScreenReaderStatus: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default withScreenReaderStatus(Filters);
