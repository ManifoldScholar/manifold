import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import useSearch from "./index";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const searchValue = useSearch();
  return (
    <SearchContext.Provider value={searchValue}>
      {children}
    </SearchContext.Provider>
  );
}

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
