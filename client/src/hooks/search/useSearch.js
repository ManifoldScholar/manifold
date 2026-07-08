import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseQueryFromUrl, serializeQueryToUrl } from "./helpers";

export default function useSearch() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => parseQueryFromUrl(location.search), [
    location.search
  ]);

  const setQuery = useCallback(
    (patch, path) => {
      navigate(
        {
          pathname: path ?? location.pathname,
          search: serializeQueryToUrl({ ...query, page: 1, ...patch })
        },
        { replace: true }
      );
    },
    [query, navigate, location.pathname]
  );

  const setPage = useCallback(
    page => event => {
      if (event) event.preventDefault();
      navigate(
        {
          pathname: location.pathname,
          search: serializeQueryToUrl({ ...query, page })
        },
        { replace: true }
      );
    },
    [query, navigate, location.pathname]
  );

  const setPerPage = useCallback(
    perPage => {
      navigate(
        {
          pathname: location.pathname,
          search: serializeQueryToUrl({
            ...query,
            page: 1,
            perPage: parseInt(perPage, 10)
          })
        },
        { replace: true }
      );
    },
    [query, navigate, location.pathname]
  );

  return { query, setQuery, setPage, setPerPage };
}
