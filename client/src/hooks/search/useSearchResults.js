import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { entityStoreActions } from "actions";
import { searchResultsAPI, requests } from "api";
import { select, meta } from "utils/entityUtils";
import { hasSearchableQuery } from "./helpers";
import useSearch from "./useSearch";

const { request, flush } = entityStoreActions;

const SearchResultsContext = createContext(null);

export function SearchProvider({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { query } = useSearch();

  const results = useSelector(state =>
    select(requests.gSearchResults, state.entityStore)
  );
  const resultsMeta = useSelector(state =>
    meta(requests.gSearchResults, state.entityStore)
  );

  const prevQueryRef = useRef(null);

  const doSearchWithQuery = useCallback(
    queryToSearch => {
      const call = searchResultsAPI.index({
        ...queryToSearch,
        page: {
          number: queryToSearch.page || 1,
          size: queryToSearch.perPage || 20
        }
      });
      dispatch(request(call, requests.gSearchResults));
    },
    [dispatch]
  );

  useEffect(() => {
    const isSearchRoute = /\/search\/?$/.test(location.pathname);
    if (!isSearchRoute) return;

    const prev = prevQueryRef.current;
    const queryChanged =
      prev?.keyword !== query.keyword ||
      prev?.scope !== query.scope ||
      prev?.page !== query.page ||
      prev?.perPage !== query.perPage ||
      prev?.order !== query.order ||
      prev?.project !== query.project ||
      prev?.text !== query.text ||
      prev?.textSection !== query.textSection ||
      JSON.stringify(prev?.facets || []) !== JSON.stringify(query.facets || []);

    prevQueryRef.current = query;

    if (!queryChanged) return;

    if (hasSearchableQuery(query)) {
      doSearchWithQuery(query);
    } else {
      dispatch(flush(requests.gSearchResults));
    }
  }, [query, doSearchWithQuery, dispatch, location.pathname]);

  useEffect(() => {
    return () => {
      dispatch(flush(requests.gSearchResults));
    };
  }, [dispatch]);

  const value = { results, resultsMeta };

  return (
    <SearchResultsContext.Provider value={value}>
      {children}
    </SearchResultsContext.Provider>
  );
}

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/* Controlled counterpart to SearchProvider, mirroring SearchQueryControlledProvider */
export function SearchResultsControlledProvider({
  results,
  resultsMeta,
  children
}) {
  const value = useMemo(() => ({ results, resultsMeta }), [
    results,
    resultsMeta
  ]);

  return (
    <SearchResultsContext.Provider value={value}>
      {children}
    </SearchResultsContext.Provider>
  );
}

SearchResultsControlledProvider.propTypes = {
  results: PropTypes.array,
  resultsMeta: PropTypes.object,
  children: PropTypes.node
};

export function useSearchResults() {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error("useSearchResults must be used within a SearchProvider");
  }
  return context;
}
