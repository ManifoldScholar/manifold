import React from "react";
import PropTypes from "prop-types";
import { useListFilters } from "hooks";
import FiltersGroup from "./Group";

export default function Filters({ className, ...props }) {
  const {
    searchProps,
    activeFilters,
    onSubmit,
    onReset,
    showReset
  } = useListFilters({
    ...props
  });

  /* eslint-disable no-nested-ternary */
  const resetLabel =
    activeFilters?.length && searchProps
      ? "Reset Search + Filters"
      : activeFilters?.length
      ? "Reset Filters"
      : "Reset Search";
  /* eslint-disable no-nested-ternary */

  return (
    <FiltersGroup
      onSubmit={onSubmit}
      filters={activeFilters}
      searchProps={searchProps}
      onReset={onReset}
      showReset={showReset}
      resetLabel={resetLabel}
      className={className}
    />
  );
}

Filters.displayName = "Global.List.Filters";

Filters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  init: PropTypes.object,
  reset: PropTypes.object,
  options: PropTypes.object,
  className: PropTypes.string
};
