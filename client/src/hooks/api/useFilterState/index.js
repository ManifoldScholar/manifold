import { useState, useCallback } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

export default function useFilterState(baseFilters = {}) {
  const location = useLocation();

  const setInitialFilterState = useCallback(() => {
    const { page, ...filterObj } = queryString.parse(location.search);
    return { ...baseFilters, ...filterObj };
  }, [baseFilters, location]);

  const [filters, setFilterState] = useState(setInitialFilterState());

  const setFilters = useCallback(
    ({ reset, newState }) => {
      if (reset) {
        setFilterState(setInitialFilterState());
        return;
      }
      if (newState) {
        setFilterState(newState);
      }
    },
    [setInitialFilterState]
  );

  return [filters, setFilters];
}
