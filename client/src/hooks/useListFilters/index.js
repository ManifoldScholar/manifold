import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import filterTypes from "global/components/list/Filters/types";
import isEqual from "lodash/isEqual";

export default function useListFilters({
  onFilterChange,
  init,
  reset,
  options
}) {
  const [filters, setFilters] = useState(init || {});
  const prevFilters = useRef(init || {});
  const [search, setSearch] = useState("");

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!isEqual(filters, prevFilters.current)) {
      prevFilters.current = filters;
      onFilterChange(filters);
    }
  }, [filters]);
  /* eslint-disable react-hooks/exhaustive-deps */

  useEffect(() => {
    setFilters(init);
  }, [init]);

  const updateFilterState = (e, label) => {
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

  const activeTypes = options
    ? Object.keys(options)
        .filter(option => Object.keys(filterTypes).includes(option))
        .filter(option =>
          Array.isArray(options[option])
            ? options[option].length
            : options[option]
        )
    : [];
  const finalTypes = options?.featured
    ? [...activeTypes, "subjects"]
    : activeTypes;
  const activeFilters = finalTypes.length
    ? finalTypes.map(type =>
        filterTypes[type](filters, updateFilterState, {
          ...options,
          featuredLabel
        })
      )
    : [];

  /* eslint-disable no-nested-ternary */
  const showReset = !reset
    ? false
    : !activeTypes.length
    ? !!filters?.keyword
    : !isEqual(reset, filters);
  /* eslint-disable no-nested-ternary */

  const onReset = useCallback(() => {
    const newState = reset || init;
    setFilters(newState);
    setSearch("");
  }, [reset, init]);

  const searchProps = options?.hideSearch
    ? null
    : {
        value: search,
        onChange: e => setSearch(e.target.value)
      };

  const onSubmit = e => updateFilterState(e, "keyword");

  return { searchProps, activeFilters, onSubmit, onReset, showReset };
}
