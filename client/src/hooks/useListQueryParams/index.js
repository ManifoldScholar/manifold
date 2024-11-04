import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

export default function useListQueryParams({
  initPage = 1,
  initSize = 20,
  initFilters,
  collectionPagination,
  initSearchProps
} = {}) {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { page, ...filterParams } = queryString.parse(search);

  const [number, setNumber] = useState(page || initPage);
  const [size] = useState(initSize);
  const [collection] = useState(collectionPagination);

  const pagination = useMemo(
    () => ({ number, size, collectionProjects: collection }),
    [number, size, collection]
  );

  const setPageNumber = useCallback(
    pageNumber => {
      if (
        typeof pageNumber === "number" &&
        pageNumber >= 1 &&
        number !== pageNumber
      )
        setNumber(pageNumber);
    },
    [number, setNumber]
  );

  const filtersReset = useRef(initFilters);

  const [filters, setFilterState] = useState({
    ...initFilters,
    ...filterParams
  });

  const updateFilterParams = useCallback(
    nextFilters => {
      const query = queryString.stringify({ page: number, ...nextFilters });

      history.push({
        pathname,
        search: query
      });
    },
    [history, pathname, number]
  );

  const setFilters = useCallback(
    newState => {
      setNumber(1);
      updateFilterParams(newState);
      setFilterState(newState);
    },
    [setFilterState, updateFilterParams]
  );

  const setFilter = useCallback(
    (field, value) => {
      if (
        initSearchProps?.setParam &&
        typeof initSearchProps.setParam === "function"
      )
        initSearchProps.setParam(field, value);

      const key = field.as || field.name;
      setFilters({ ...filters, [key]: value });
    },
    [initSearchProps, setFilters, filters]
  );

  const onReset = useCallback(() => {
    if (
      initSearchProps?.onReset &&
      typeof initSearchProps.onReset === "function"
    )
      initSearchProps.onReset();
    setFilters(filtersReset?.current);
    updateFilterParams(filtersReset?.current);
  }, [initSearchProps, setFilters, updateFilterParams]);

  useEffect(() => {
    const parsed = parseInt(page, 10);

    if (parsed >= 1 && parsed !== number) setNumber(parsed);
  }, [page, number]);

  const searchProps = useMemo(
    () => ({ ...initSearchProps, onReset, setParam: setFilter }),
    [initSearchProps, onReset, setFilter]
  );

  return {
    pagination,
    setPageNumber,
    filters,
    setFilters,
    onReset,
    searchProps
  };
}
