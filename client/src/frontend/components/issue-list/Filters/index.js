import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ListFilters } from "global/components/list";
import useFilterTypes from "./hooks/useFilterTypes";

export default function IssueListFilters(props) {
  const {
    filterChangeHandler,
    initialFilterState,
    resetFilterState,
    subjects,
    hideFeatured = false
  } = props;

  const [filters, setFilters] = useState(initialFilterState);
  const [search, setSearch] = useState("");
  // TODO: update this when using filters other than search
  // const showResetButton = !!Object.values(filters).filter(Boolean).length;
  const showResetButton = !!filters.keyword;

  useEffect(() => {
    filterChangeHandler(filters);
  }, [filters, filterChangeHandler]);

  const updateFilters = (e, label) => {
    e.preventDefault();

    switch (label) {
      case "keyword":
        return setFilters({ ...filters, [label]: search });
      case "order":
        return setFilters({ ...filters, [label]: e.target.value });
      default:
        if (e.target.value === "featured") {
          return setFilters({ featured: true });
        }
        return setFilters({ subject: e.target.value });
    }
  };

  const filterTypes = useFilterTypes(
    filters,
    setFilters,
    updateFilters,
    subjects,
    hideFeatured,
    { sort: false, featuredAndSubject: false }
  );

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
      searchProps={searchProps}
      filters={filterTypes}
      onSubmit={e => updateFilters(e, "keyword")}
      onReset={resetFilters}
      showResetButton={showResetButton}
    />
  );
}

IssueListFilters.displayName = "IssueList.Filters";

IssueListFilters.propTypes = {
  filterChangeHandler: PropTypes.func,
  initialFilterState: PropTypes.object,
  resetFilterState: PropTypes.object,
  subjects: PropTypes.array,
  hideFeatured: PropTypes.bool
};
