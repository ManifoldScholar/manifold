import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { parseQueryFromUrl, serializeQueryToUrl } from "./helpers";

export default function useSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchQueryState = useMemo(() => parseQueryFromUrl(location.search), [
    location.search
  ]);

  const setQueryState = useCallback(
    (params, path) => {
      const urlParams = serializeQueryToUrl(params);
      navigate(
        {
          pathname: path ?? location.pathname,
          search: urlParams
        },
        { replace: true }
      );
    },
    [navigate, location.pathname]
  );

  const setPage = useCallback(
    page => {
      return event => {
        if (event) event.preventDefault();
        const newQuery = { ...searchQueryState, page };
        setQueryState(newQuery);
      };
    },
    [searchQueryState, setQueryState]
  );

  return {
    searchQueryState,
    setQueryState,
    setPage
  };
}
