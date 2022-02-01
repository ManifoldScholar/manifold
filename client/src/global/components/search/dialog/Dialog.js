import React, { useState } from "react";
import PropTypes from "prop-types";
import Dialog from "global/components/dialog";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useDispatchSearchResults, useSelectSearchResults } from "hooks";

const DEFAULT_PAGE = 1;
const PER_PAGE = 5;
const INIT_PAGINATION_STATE = {
  number: DEFAULT_PAGE,
  size: PER_PAGE
};

function SearchDialog({ onClose, header, labelledBy, describedBy }) {
  const [query, setQuery] = useState(null);
  const [pagination, setPagination] = useState(INIT_PAGINATION_STATE);

  useDispatchSearchResults(query, pagination);

  const { results, resultsMeta } = useSelectSearchResults();

  function setPageNumber(number) {
    setPagination(prevState => {
      return { ...prevState, number };
    });
  }

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
            paginationClickHandler={setPageNumber}
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
