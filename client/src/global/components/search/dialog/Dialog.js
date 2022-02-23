import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import Dialog from "global/components/dialog";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useFetch, usePaginationState } from "hooks";
import { searchResultsAPI } from "api";

function SearchDialog({ onClose, header, labelledBy, describedBy }) {
  const [query, setQuery] = useState(null);
  const [pagination, setPageNumber] = usePaginationState(1, 5);

  const queryAndPagination = useMemo(() => {
    return { ...query, page: pagination };
  }, [query, pagination]);

  const { data: results, meta: resultsMeta } = useFetch({
    request: [searchResultsAPI.index, queryAndPagination],
    condition: query
  });

  function handleCloseClick(event) {
    event.stopPropagation();
    onClose();
  }

  const facets = [
    { label: "Projects", value: "Project" },
    { label: "Resources", value: "Resource" },
    { label: "Texts", value: "Text" },
    { label: "Full Text", value: "TextSection" }
  ];

  return (
    <Dialog.Wrapper
      labelledBy={labelledBy}
      describedBy={describedBy}
      closeCallback={onClose}
      maxWidth={950}
      className="search-dialog"
    >
      {header}
      <div className="search-dialog__form">
        <h2 className="screen-reader-text">Search Form</h2>
        <SearchQuery.Form
          initialState={{
            keyword: ""
          }}
          searchQueryState={query}
          setQueryState={setQuery}
          facets={facets}
        />
      </div>
      {results && (
        <div className="search-dialog__results">
          <h2 className="screen-reader-text">Search Results</h2>
          <SearchResults.List
            pagination={resultsMeta.pagination}
            paginationClickHandler={page => () => setPageNumber(page)}
            results={results}
            context="frontend"
          />
        </div>
      )}
      <div className="search-dialog__footer">
        <button
          onClick={handleCloseClick}
          className="search-dialog__close-button button-secondary"
        >
          Close
        </button>
      </div>
    </Dialog.Wrapper>
  );
}

SearchDialog.displayName = "Search.Dialog";

SearchDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  header: PropTypes.node,
  labelledBy: PropTypes.string,
  describedBy: PropTypes.string
};

export default SearchDialog;
