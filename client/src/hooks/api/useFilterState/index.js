import { useState, useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import queryString from "query-string";

function getSearch(location) {
  return queryString.parse(location.search);
}

export default function useFilterState(location, initialState = {}) {
  const [filters, setFilterState] = useState(setInitialFilterState());

  function setInitialFilterState() {
    const { page, ...filterObj } = getSearch(location);
    if (isEmpty(filterObj)) return initialState;
    return filterObj;
  }

  const setFilters = useCallback(({ reset, param }) => {
    if (reset) {
      setFilterState(setInitialFilterState(location));
      return;
    }
    if (param) {
      setFilterState(param);
    }
  });

  return [filters, setFilters];
}
