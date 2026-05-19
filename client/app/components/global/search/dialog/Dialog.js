import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Dialog from "components/global/dialog";
import SearchQuery from "components/global/search/query";
import SearchResults from "components/global/search/results";
import { useFetch } from "hooks";
import { searchResultsAPI } from "api";

function SearchDialog({ onClose, header, labelledBy, describedBy }) {
  const [query, setQuery] = useState({ page: { number: 1, size: 5 } });

  const { data: results, meta: resultsMeta } = useFetch(
    () => searchResultsAPI.index(query),
    [query.keyword, query.page.number, query.facets],
    { condition: !!query.keyword }
  );

  const { t } = useTranslation();

  function handleCloseClick(event) {
    event.stopPropagation();
    onClose();
  }

  const facets = [
    { label: t("glossary.project_other"), value: "Project" },
    { label: t("glossary.resource_other"), value: "Resource" },
    { label: t("glossary.text_other"), value: "Text" },
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
          <div className="search-dialog__results">
            <h2 className="screen-reader-text">{t("search.results")}</h2>
            <SearchResults.List
              pagination={resultsMeta.pagination}
              paginationClickHandler={page => () =>
                setQuery({ ...query, page: { ...query.page, number: page } })}
              results={results}
              context="frontend"
              padding={1}
            />
          </div>
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
