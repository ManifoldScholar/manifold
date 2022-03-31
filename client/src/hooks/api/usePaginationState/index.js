import { useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

export default function usePaginationState(
  initialNumber = 1,
  initialSize = 20,
  collectionProjects = null
) {
  const location = useLocation();
  const { page } = queryString.parse(location.search);
  const currentPage = page || initialNumber;

  const [number, setNumber] = useState(currentPage);
  const [size, setSize] = useState(initialSize);

  const setPageNumber = useCallback(
    pageNumber => {
      if (number !== pageNumber) setNumber(pageNumber);
    },
    [number, setNumber]
  );

  const setPageSize = useCallback(
    pageSize => {
      if (size !== pageSize) setSize(pageSize);
    },
    [size, setSize]
  );

  const pagination = useMemo(() => ({ number, size, collectionProjects }), [
    number,
    size,
    collectionProjects
  ]);

  return [pagination, setPageNumber, setPageSize];
}
