import React, { useRef } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Search from "./Search";
import Filter from "./Filter";
import { useListFilters } from "hooks";
import * as Styled from "./styles";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";

function Filters({ setScreenReaderStatus, className, ...props }) {
  const searchInput = useRef(null);

  const {
    searchProps,
    activeFilters,
    onSubmit,
    onReset,
    showReset
  } = useListFilters({
    ...props
  });

  function handleReset() {
    onReset();
    setScreenReaderStatus("Search and filters reset.");
    if (searchInput.current) searchInput.current.focus();
  }

  /* eslint-disable no-nested-ternary */
  const resetLabel =
    activeFilters?.length && searchProps
      ? "Reset Search + Filters"
      : activeFilters?.length
      ? "Reset Filters"
      : "Reset Search";
  /* eslint-disable no-nested-ternary */

  return (
    <Styled.Wrapper
      as={onSubmit ? "form" : "div"}
      onSubmit={onSubmit}
      $count={activeFilters?.length || 0}
      $searchCount={!isEmpty(searchProps) ? 1 : 0}
      className={className}
    >
      {!isEmpty(searchProps) && (
        <Search inputRef={searchInput} {...searchProps} />
      )}
      <Styled.SelectGroup $count={activeFilters?.length || 0}>
        {activeFilters &&
          activeFilters.map(filter => (
            <Filter key={filter.label} {...filter} />
          ))}
      </Styled.SelectGroup>
      {showReset && (
        <Styled.ResetButton type="reset" onClick={handleReset}>
          {resetLabel}
        </Styled.ResetButton>
      )}
    </Styled.Wrapper>
  );
}

Filters.displayName = "Global.List.Filters";

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  init: PropTypes.object,
  reset: PropTypes.object,
  options: PropTypes.object,
  setScreenReaderStatus: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default withScreenReaderStatus(Filters);
