import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ListFilters from "./index";
import useFilterTypes from "./hooks/useFilterTypes";

export default function ListFiltersWrapper(props) {
  const {
    filterChangeHandler,
    initialFilterState,
    resetFilterState,
    active,
    subjects,
    hideFeatured = false,
    texts,
    sections,
    memberships,
    showSearch = true
  } = props;

  const [filters, setFilters] = useState(initialFilterState || {});
  const prevFilters = useRef(initialFilterState || {});
  const [search, setSearch] = useState("");

  const showResetButton = !!Object.keys(filters)?.find(
    filter => filters[filter]
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (filters !== prevFilters.current) {
      prevFilters.current = filters;
      filterChangeHandler(filters);
    }
  }, [filters]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const updateFilters = (e, label) => {
    e.preventDefault();

    switch (label) {
      case "keyword":
        return setFilters({ ...filters, [label]: search });
      case "subject":
        if (e.target.value === "featured") {
          return setFilters({ featured: true });
        }
        return setFilters({ subject: e.target.value });
      default:
        return setFilters({ ...filters, [label]: e.target.value });
    }
  };

  const { pathname } = useLocation();
  /* eslint-disable-next-line no-nested-ternary */
  const featuredLabel = pathname.includes("projects")
    ? "Featured Projects"
    : pathname.includes("issues")
    ? "Featured Issues"
    : "Featured";

  const activeFilters = useFilterTypes({
    filters,
    updateFilters,
    active,
    params: {
      subjects,
      hideFeatured,
      texts,
      sections,
      memberships,
      showSearch,
      featuredLabel
    }
  });

  const resetFilters = () => {
    const newState = resetFilterState
      ? { ...resetFilterState }
      : initialFilterState;
    setFilters(newState);
  };

  const searchProps = {
    value: search,
    onChange: e => setSearch(e.target.value)
  };

  return (
    <ListFilters
      searchProps={showSearch ? searchProps : null}
      filters={activeFilters}
      onSubmit={e => updateFilters(e, "keyword")}
      onReset={resetFilters}
      showResetButton={showResetButton}
    />
  );
}

ListFiltersWrapper.displayName = "List.Filters.Wrapper";

ListFiltersWrapper.propTypes = {
  filterChangeHandler: PropTypes.func,
  initialFilterState: PropTypes.object,
  resetFilterState: PropTypes.object,
  subjects: PropTypes.array,
  hideFeatured: PropTypes.bool
};
