import { useState } from "react";
import queryString from "query-string";

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

function getSearch(location) {
  return queryString.parse(location.search);
}

function setInitialPaginationState(location, perPage) {
  const { page } = getSearch(location);
  return {
    number: page || DEFAULT_PAGE,
    size: perPage || DEFAULT_PER_PAGE
  };
}

export default function usePaginationState(location, perPage) {
  const [paginationState, setPaginationState] = useState(
    setInitialPaginationState(location, perPage)
  );

  const handlePageChange = param => {
    setPaginationState(prevState => {
      return { ...prevState, number: param };
    });
  };

  return { paginationState, handlePageChange };
}
