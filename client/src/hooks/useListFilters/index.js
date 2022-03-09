import { useState, useRef, useCallback, useEffect } from "react";
import filterTypes from "global/components/list/Filters/types";
import isEqual from "lodash/isEqual";
import { useTranslation } from "react-i18next";

export default function useListFilters({
  onFilterChange,
  initialState,
  resetState,
  options = {}
}) {
  const [filters, setFilters] = useState(initialState || {});
  const prevFilters = useRef(initialState || {});
  const previnitialState = useRef(initialState || {});
  const { t } = useTranslation();

  useEffect(() => {
    if (!isEqual(initialState, previnitialState.current)) {
      previnitialState.current = initialState;
      prevFilters.current = initialState;
      setFilters(initialState);
      return;
    }
    if (!isEqual(filters, prevFilters.current)) {
      prevFilters.current = filters;
      onFilterChange(filters);
    }
  }, [filters, initialState, onFilterChange]);

  const updateFilterState = useCallback(
    (e, label, search) => {
      e.preventDefault();

      switch (label) {
        case "keyword":
          return setFilters({ ...filters, keyword: search });
        case "subject":
          if (e.target.value === "featured") {
            return setFilters({ featured: true });
          }
          return setFilters({ subject: e.target.value });
        default:
          return setFilters({ ...filters, [label]: e.target.value });
      }
    },
    [filters, setFilters]
  );

  const featuredLabel = options.featuredLabel ?? "Featured";

  const activeTypes = options
    ? Object.keys(options)
        .filter(option => Object.keys(filterTypes).includes(option))
        .filter(option =>
          Array.isArray(options[option])
            ? options[option].length
            : options[option]
        )
    : [];
  const finalTypes =
    options?.featured && !options.subjects
      ? [...activeTypes, "subjects"]
      : activeTypes;
  const activeFilters = finalTypes.length
    ? finalTypes.map(type =>
        filterTypes[type](
          filters,
          updateFilterState,
          {
            ...options,
            featuredLabel
          },
          t
        )
      )
    : [];

  /* eslint-disable no-nested-ternary */
  const showReset = !resetState
    ? false
    : !activeTypes.length
    ? !!filters?.keyword
    : !isEqual(resetState, filters);
  /* eslint-disable no-nested-ternary */

  const onReset = useCallback(() => {
    const newState = resetState || initialState;
    setFilters(newState);
  }, [resetState, initialState]);

  return { filters: activeFilters, updateFilterState, onReset, showReset };
}
