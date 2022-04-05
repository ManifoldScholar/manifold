import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import PropTypes from "prop-types";
import withSearch from "hoc/withSearch";
import * as Styled from "./styles";

const SearchContainer = forwardRef((props, ref) => {
  const {
    results,
    resultsMeta,
    searchQueryState,
    setQueryState,
    setPage
  } = props;

  const { t } = useTranslation();

  const facets = [
    { label: t("glossary.project_other"), value: "Project" },
    { label: t("glossary.journal_other"), value: "Journal" },
    { label: t("glossary.resource_other"), value: "Resource" },
    { label: t("glossary.text_other"), value: "Text" },
    { label: t("glossary.annotation_other"), value: "Annotation" },
    { label: t("glossary.full_text_other"), value: "TextSection" }
  ];

  return (
    <div ref={ref}>
      <h1 className="screen-reader-text">{t("search.title")}</h1>
      <Styled.FormWrapper>
        <Styled.Inner>
          <h2 className="screen-reader-text">{t("search.form")}</h2>
          <SearchQuery.Form
            initialState={{
              keyword: ""
            }}
            searchQueryState={searchQueryState}
            setQueryState={setQueryState}
            facets={facets}
          />
        </Styled.Inner>
      </Styled.FormWrapper>
      {results && (
        <Styled.ResultsWrapper>
          <Styled.Inner>
            <h2 className="screen-reader-text">{t("search.results")}</h2>
            <SearchResults.List
              pagination={resultsMeta.pagination}
              paginationClickHandler={setPage}
              results={results}
              context="frontend"
            />
          </Styled.Inner>
        </Styled.ResultsWrapper>
      )}
    </div>
  );
});

SearchContainer.displayName = "Frontend.SearchContainer";

SearchContainer.propTypes = {
  results: PropTypes.array,
  resultsMeta: PropTypes.object,
  searchQueryState: PropTypes.object.isRequired,
  setQueryState: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
};

export default withSearch(SearchContainer);
