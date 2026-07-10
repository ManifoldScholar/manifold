import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Dialog from "global/components/dialog";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { SearchResultsControlledProvider } from "hooks/search/useSearchResults";
import { useFetch } from "hooks";
import { searchResultsAPI } from "api";

function SearchDialog({ onClose, header, labelledBy, describedBy }) {
  const [query, setQuery] = useState({ page: { number: 1, size: 5 } });

  const { data: results, meta: resultsMeta } = useFetch({
    request: [searchResultsAPI.index, query],
    condition: !!query.keyword
  });

  const { t } = useTranslation();

  function handleCloseClick(event) {
    event.stopPropagation();
    onClose();
  }

  const facets = [
    { label: t("glossary.project_other"), value: "Project", default: true },
    { label: t("glossary.resource_other"), value: "Resource", default: true },
    { label: t("glossary.text_other"), value: "Text", default: true },
    { label: t("glossary.full_text_other"), value: "TextSection" }
  ];

  return (
    <Dialog.Wrapper
      labelledBy={labelledBy}
      describedBy={describedBy}
      closeCallback={onClose}
      maxWidth={950}
      className="search-dialog"
    >
      <SearchQuery.ControlledProvider query={query} setQuery={setQuery}>
        {header}
        <div className="search-dialog__form">
          <h2 className="screen-reader-text">{t("search.form")}</h2>
          <SearchQuery.Form facets={facets} autoFocus />
        </div>
        {results && (
          <SearchResultsControlledProvider
            results={results}
            resultsMeta={resultsMeta}
          >
            <div className="search-dialog__results">
              <h2 className="screen-reader-text">{t("search.results")}</h2>
              <SearchResults.List context="frontend" padding={1} />
            </div>
          </SearchResultsControlledProvider>
        )}
        <div className="search-dialog__footer">
          <button
            onClick={handleCloseClick}
            className="search-dialog__close-button button-secondary"
          >
            {t("actions.close")}
          </button>
        </div>
      </SearchQuery.ControlledProvider>
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
