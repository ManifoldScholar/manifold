import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { parseQueryFromUrl, serializeQueryToUrl } from "./helpers";

export default function useSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchQueryState = useMemo(() => parseQueryFromUrl(location.search), [
    location.search
  ]);

  const setQuery = useCallback(
    (patch, path) =>
      navigate(
        {
          pathname: path ?? location.pathname,
          search: serializeQueryToUrl({
            ...searchQueryState,
            page: 1,
            ...patch
          })
        },
        { replace: true }
      ),
    [searchQueryState, navigate, location.pathname]
  );

  const setPage = useCallback(
    page => event => {
      if (event) event.preventDefault();
      navigate(
        {
          pathname: location.pathname,
          search: serializeQueryToUrl({ ...searchQueryState, page })
        },
        { replace: true }
      );
    },
    [searchQueryState, navigate, location.pathname]
  );

  return {
    searchQueryState,
    setQuery,
    setPage
  };
}
