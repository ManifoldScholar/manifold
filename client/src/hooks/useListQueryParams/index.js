import { useEffect, useCallback, useMemo, useState } from "react";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router-dom";

export default function useListQueryParams({
  initPage = 1,
  initSize = 20,
  initFilters,
  collectionProjects,
  initSearchProps
}) {
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { page, ...filterParams } = queryString.parse(search);

  const [number, setNumber] = useState(page || initPage);
  const [size] = useState(initSize);

  const pagination = useMemo(() => ({ number, size, collectionProjects }), [
    number,
    size,
    collectionProjects
  ]);

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

  const [filters, setFilterState] = useState({
    ...initFilters,
    ...filterParams
  });

  const updateFilterParams = useCallback(
    nextFilters => {
      const params = page ? { ...nextFilters, page } : nextFilters;
      const query = queryString.stringify(params);

      history.push({
        pathname,
        query
      });
    },
    [page, history, pathname]
  );

  const setFilters = useCallback(
    newState => {
      setFilterState(newState);
      updateFilterParams(newState);
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
      setFilters({ ...filters, [field.as || field.name]: value });
    },
    [initSearchProps, setFilters, filters]
  );

  const onReset = useCallback(() => {
    if (
      initSearchProps?.onReset &&
      typeof initSearchProps.onReset === "function"
    )
      initSearchProps.onReset();
    setFilters(initFilters);
    updateFilterParams(initFilters);
  }, [initSearchProps, setFilters, updateFilterParams, initFilters]);

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
