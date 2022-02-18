import React, { useRef } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Search from "../Search";
import Filter from "../Filter";
import * as Styled from "./styles";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";

function FiltersGroup(props) {
  const {
    onSubmit,
    filters,
    searchProps,
    onReset,
    showReset,
    resetLabel,
    setScreenReaderStatus,
    className
  } = props;

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
      $count={filters?.length || 0}
      $searchCount={!isEmpty(searchProps) ? 1 : 0}
      className={className}
    >
      {!isEmpty(searchProps) && (
        <Search inputRef={searchInput} {...searchProps} />
      )}
      <Styled.SelectGroup $count={filters?.length || 0}>
        {filters &&
          filters.map(filter => <Filter key={filter.label} {...filter} />)}
      </Styled.SelectGroup>
      {showReset && (
        <Styled.ResetButton type="reset" onClick={handleReset}>
          {resetLabel}
        </Styled.ResetButton>
      )}
    </Styled.Wrapper>
  );
}

FiltersGroup.displayName = "Global.List.Filters.FiltersGroup";

FiltersGroup.propTypes = {
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  showReset: PropTypes.bool,
  resetLabel: PropTypes.string,
  filters: PropTypes.array,
  searchProps: PropTypes.object,
  setScreenReaderStatus: PropTypes.func,
  className: PropTypes.string
};

export default withScreenReaderStatus(FiltersGroup);
