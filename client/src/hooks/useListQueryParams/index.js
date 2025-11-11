import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import queryString from "query-string";
import { useNavigate, useLocation } from "react-router-dom";

export default function useListQueryParams({
  initPage = 1,
  initSize = 20,
  initFilters,
  collectionPagination,
  initSearchProps,
  scrollTargetId
} = {}) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { page, formats, ...filterParams } = queryString.parse(search);

  /* eslint-disable no-nested-ternary */
  const formatsValue = formats
    ? Array.isArray(formats)
      ? { formats }
      : { formats: [formats] }
    : {};

  const [number, setNumber] = useState(page || initPage);
  const size = useRef(initSize);
  const collection = useRef(collectionPagination);

  // Pagination
  const pagination = useMemo(
    () => ({
      number,
      size: size.current,
      collectionProjects: collection.current
    }),
    [number]
  );

  useEffect(() => {
    const parsed = parseInt(page, 10);

    if (parsed >= 1 && parsed !== number) setNumber(parsed);
  }, [page, number]);

  // Filters
  const filtersReset = useRef(initFilters);

  const [filters, setFilterState] = useState({
    ...initFilters,
    ...filterParams,
    ...formatsValue
  });

  const updateFilterParams = useCallback(
    nextFilters => {
      const query = queryString.stringify({ page: 1, ...nextFilters });

      navigate({
        pathname,
        search: query,
        hash: scrollTargetId ? `#${scrollTargetId}` : undefined
      });
    },
    [navigate, pathname, scrollTargetId]
  );

  // Frontend updates a filters object
  const setFilters = useCallback(
    newState => {
      updateFilterParams(newState);
      setFilterState(newState);
    },
    [setFilterState, updateFilterParams]
  );

  // Most backend list still use entityListSearchProps which set filters individually
  const setFilter = useCallback(
    (field, value) => {
      const key = field.as || field.name;
      setFilters({ ...filters, [key]: value });
    },
    [setFilters, filters]
  );

  // Legacy reset function for entityListSearchProps; frontend uses setFilters
  const onReset = useCallback(() => {
    setFilters(filtersReset?.current);
    updateFilterParams(filtersReset?.current);
  }, [setFilters, updateFilterParams]);

  const searchProps = useCallback(() => {
    if (!initSearchProps) return {};

    const values = initSearchProps?.values
      ? Object.keys(initSearchProps.values).reduce((obj, next) => {
          return {
            ...obj,
            [next]: filters[next] ?? initSearchProps.values[next]
          };
        }, {})
      : filters;

    return {
      ...initSearchProps,
      values,
      onReset,
      setParam: setFilter
    };
  }, [initSearchProps, onReset, setFilter, filters]);

  return {
    pagination,
    filters,
    setFilters,
    searchProps: searchProps()
  };
}
