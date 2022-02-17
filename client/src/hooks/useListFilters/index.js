import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import filterTypes from "global/components/list/Filters/types";
import isEqual from "lodash/isEqual";

export default function useListFilters({
  filterChangeHandler,
  init,
  reset,
  active = [],
  ...params
}) {
  const [filters, setFilters] = useState(init || {});
  const prevFilters = useRef(init || {});
  const [search, setSearch] = useState("");

  const showReset = !isEqual(reset, filters);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!isEqual(filters, prevFilters.current)) {
      prevFilters.current = filters;
      filterChangeHandler(filters);
    }
  }, [filters]);
  /* eslint-disable react-hooks/exhaustive-deps */

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

  const activeFilters = active.length
    ? active.map(type =>
        filterTypes[type](filters, updateFilterState, {
          ...params,
          featuredLabel
        })
      )
    : [];

  const onReset = useCallback(() => {
    const newState = reset || init;
    setFilters(newState);
  }, [reset, init]);

  const searchProps = params.hideSearch
    ? null
    : {
        value: search,
        onChange: e => setSearch(e.target.value)
      };

  const onSubmit = e => updateFilterState(e, "keyword");

  return { searchProps, activeFilters, onSubmit, onReset, showReset };
}
