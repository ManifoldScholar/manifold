import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Search from "./Search";
import Filter, { filterShape } from "./Filter";

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
  const Wrapper = onSubmit ? "form" : "div";

  function handleReset() {
    onReset();
    setScreenReaderStatus("Search and filters reset.");
    if (searchInput.current) searchInput.current.focus();
  }

  return (
    <Wrapper
      onSubmit={onSubmit}
      className={classNames({
        "form-list-filter": true,
        [className]: !!className
      })}
    >
      {searchProps && <Search inputRef={searchInput} {...searchProps} />}
      <div
        className={classNames({
          "form-list-filter__select-group": true,
          [`form-list-filter__select-group--count-${filters.length}`]: true
        })}
      >
        {filters.map(filter => (
          <Filter key={filter.label} {...filter} />
        ))}
      </div>
      {showResetButton && (
        <button
          type="button"
          className="form-list-filter__reset-button"
          onClick={handleReset}
        >
          {"Reset Search + Filters"}
        </button>
      )}
    </Wrapper>
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
