import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";

/* Search results are fetched by the search route's loader (see
 * lib/react-router/loaders/search.js) and supplied to the results tree via
 * this provider. The dialog and menu supply client-fetched results the same
 * way, so consumers (`SearchResults.List`) never care where results came from. */

const SearchResultsContext = createContext(null);

export function SearchResultsProvider({ results, resultsMeta, children }) {
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

SearchResultsProvider.displayName = "Search.Results.Provider";

SearchResultsProvider.propTypes = {
  results: PropTypes.array,
  resultsMeta: PropTypes.object,
  children: PropTypes.node
};

/* Kept for parity with SearchQueryControlledProvider naming. */
export const SearchResultsControlledProvider = SearchResultsProvider;

export function useSearchResults() {
  const context = useContext(SearchResultsContext);
  if (!context) {
    throw new Error(
      "useSearchResults must be used within a SearchResultsProvider"
    );
  }
  return context;
}
