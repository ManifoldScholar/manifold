import { useState } from "react";
import isEmpty from "lodash/isEmpty";
import queryString from "query-string";

const INIT_FILTER_STATE = {};

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialFilterState(location, init) {
  const { page, ...filters } = getSearch(location);
  if (isEmpty(filters)) return init || INIT_FILTER_STATE;
  return filters;
}

export default function useFilterState(location, init) {
  const [filterState, setFilterState] = useState(
    setInitialFilterState(location, init)
  );

  const updateFilterState = ({ reset, param }) => {
    if (reset) {
      setFilterState(setInitialFilterState(location));
      return;
    }
    if (param) {
      setFilterState(param);
    }
  };

  return { filterState, updateFilterState };
}
