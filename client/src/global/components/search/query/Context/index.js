import { createContext, useContext, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import useSearch from "hooks/useSearch";
import { scopeToPatch } from "hooks/useSearch/helpers";
import useFacets from "./hooks/useFacets";
import useControlled from "./hooks/useControlled";

const SearchQueryContext = createContext(null);

export function SearchQueryProvider({ children }) {
  const formRef = useRef(null);
  const {
    query: { keyword, scope, facets },
    setQuery
  } = useSearch();
  const { facetsCleared, setFacets, onSubmit } = useFacets({ formRef });

  const value = useMemo(
    () => ({
      formRef,
      keyword: {
        value: keyword,
        inputKey: keyword,
        inputProps: { name: "keyword", defaultValue: keyword },
        onClear: () => setQuery({ keyword: "" })
      },
      scope: {
        value: scope,
        set: (next, scopes) => setQuery(scopeToPatch(next, scopes))
      },
      facets: {
        value: facets,
        cleared: facetsCleared,
        set: setFacets
      },
      onSubmit
    }),
    [keyword, scope, facets, setQuery, facetsCleared, setFacets, onSubmit]
  );

  return (
    <SearchQueryContext.Provider value={value}>
      {children}
    </SearchQueryContext.Provider>
  );
}

SearchQueryProvider.displayName = "Search.Query.Provider";

SearchQueryProvider.propTypes = {
  children: PropTypes.node
};

export function SearchQueryControlledProvider({ query, setQuery, children }) {
  const {
    facetsCleared,
    setFacets,
    onSubmit,
    keyword,
    setKeyword
  } = useControlled({
    query,
    setQuery
  });
  const { scope, facets } = query ?? {};

  const value = useMemo(
    () => ({
      keyword: {
        value: keyword,
        inputProps: {
          name: "keyword",
          value: keyword,
          onChange: event => setKeyword(event.target.value)
        },
        onClear: () => setKeyword("")
      },
      scope: {
        value: scope,
        set: (next, scopes) =>
          setQuery({
            ...query,
            ...scopeToPatch(next, scopes)
          })
      },
      facets: {
        value: facets,
        cleared: facetsCleared,
        set: setFacets
      },
      onSubmit
    }),
    [
      keyword,
      setKeyword,
      scope,
      facets,
      onSubmit,
      facetsCleared,
      setFacets,
      query,
      setQuery
    ]
  );

  return (
    <SearchQueryContext.Provider value={value}>
      {children}
    </SearchQueryContext.Provider>
  );
}

SearchQueryControlledProvider.displayName = "Search.Query.ControlledProvider";

SearchQueryControlledProvider.propTypes = {
  query: PropTypes.object,
  setQuery: PropTypes.func.isRequired,
  children: PropTypes.node
};

export function useSearchQueryContext(componentName) {
  const ctx = useContext(SearchQueryContext);
  if (!ctx) {
    throw new Error(
      `${componentName ??
        "Component"} must be rendered inside <Search.Query.Provider> or <Search.Query.ControlledProvider>.`
    );
  }
  return ctx;
}
