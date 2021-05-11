import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Search from "./Search";
import Filter, { filterShape } from "./Filter";

function Filters({
  searchProps,
  filters,
  onSubmit,
  onReset,
  showResetButton,
  className
}) {
  const Wrapper = onSubmit ? "form" : "div";
  return (
    <Wrapper
      onSubmit={onSubmit}
      className={classNames({
        "form-list-filter": true,
        [className]: !!className
      })}
    >
      {searchProps && <Search {...searchProps} />}
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
        <button className="form-list-filter__reset-button" onClick={onReset}>
          {"Reset Search + Filters"}
        </button>
      )}
    </Wrapper>
  );
}

Filters.displayName = "Global.List.Filters";

Filters.propTypes = {
  searchProps: PropTypes.shape({
    inputRef: PropTypes.object.isRequired,
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
  className: PropTypes.string
};

export default Filters;
