import { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { entityStoreActions } from "actions";
import { searchResultsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";

const { request, flush } = entityStoreActions;

const hasSearchableQuery = queryState => {
  if (!queryState) return false;
  return queryState.keyword?.trim();
};

const parseQueryFromUrl = search => {
  const params = queryString.parse(search);
  const query = {
    keyword: params.keyword || "",
    scope: params.scope || null,
    // eslint-disable-next-line no-nested-ternary
    facets: params.facets
      ? Array.isArray(params.facets)
        ? params.facets
        : params.facets.split(",")
      : [],
    page: params.page ? parseInt(params.page, 10) : 1,
    project: params.project || null,
    text: params.text || null,
    textSection: params.textSection || null
  };
  return query;
};

const serializeQueryToUrl = query => {
  const params = {};
  if (query.keyword) params.keyword = query.keyword;
  if (query.scope) params.scope = query.scope;
  if (query.facets && query.facets.length > 0) {
    params.facets = query.facets.join(",");
  }
  if (query.page && query.page > 1) params.page = query.page;
  if (query.project) params.project = query.project;
  if (query.text) params.text = query.text;
  if (query.textSection) params.textSection = query.textSection;
  return queryString.stringify(params);
};

export default function useSearch() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const results = useSelector(state =>
    select(requests.rSearchResults, state.entityStore)
  );
  const resultsMeta = useSelector(state =>
    meta(requests.rSearchResults, state.entityStore)
  );

  const searchQueryState = useMemo(() => parseQueryFromUrl(location.search), [
    location.search
  ]);

  const prevSearchQueryStateRef = useRef(null);

  const doSearchWithQuery = useCallback(
    (queryToSearch, page = 1) => {
      const pagination = { number: page };
      const query = { ...queryToSearch };
      query.page = pagination;
      const call = searchResultsAPI.index(query);
      dispatch(request(call, requests.rSearchResults));
    },
    [dispatch]
  );

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

  useEffect(() => {
    const isSearchRoute = /\/search\/?$/.test(location.pathname);
    if (!isSearchRoute) return;

    const prevQuery = prevSearchQueryStateRef.current;
    const queryChanged =
      prevQuery?.keyword !== searchQueryState.keyword ||
      prevQuery?.scope !== searchQueryState.scope ||
      JSON.stringify(prevQuery?.facets || []) !==
        JSON.stringify(searchQueryState.facets || []);

    if (queryChanged && hasSearchableQuery(searchQueryState)) {
      prevSearchQueryStateRef.current = searchQueryState;
      doSearchWithQuery(searchQueryState, searchQueryState.page);
    } else {
      prevSearchQueryStateRef.current = searchQueryState;
    }
  }, [searchQueryState, doSearchWithQuery, location.pathname]);

  useEffect(() => {
    return () => {
      dispatch(flush(requests.rSearchResults));
    };
  }, [dispatch]);

  return {
    results,
    resultsMeta,
    searchQueryState,
    setQueryState,
    setPage,
    doSearchWithQuery,
    location,
    navigate
  };
}
