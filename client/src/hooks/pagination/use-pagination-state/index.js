import { useState } from "react";
import queryString from "query-string";

const DEFAULT_PAGE = 1;
const PER_PAGE = 10;

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialPaginationState(location) {
  const { page } = getSearch(location);
  return {
    number: page || DEFAULT_PAGE,
    size: PER_PAGE
  };
}

export default function usePaginationState(location) {
  const [paginationState, setPaginationState] = useState(
    setInitialPaginationState(location)
  );

  const handlePageChange = param => {
    setPaginationState(prevState => {
      return { ...prevState, number: param };
    });
  };

  return { paginationState, handlePageChange };
}
