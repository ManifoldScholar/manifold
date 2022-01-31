import React, { useState, useCallback, useMemo } from "react";

export default function usePaginationState(
  initialNumber = 1,
  initialSize = 20
) {
  const [number, setNumber] = useState(initialNumber);
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

  const pagination = useMemo(() => ({ number, size }), [number, size]);

  return [pagination, setPageNumber, setPageSize];
}
