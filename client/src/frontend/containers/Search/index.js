import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useSearchResults } from "hooks/useSearch/context";
import useSearch from "hooks/useSearch";
import * as Styled from "./styles";

const SearchContainer = forwardRef((props, ref) => {
  const { results, resultsMeta } = useSearchResults();
  const { setPage } = useSearch();

  const { t } = useTranslation();

  const facets = [
    { label: t("glossary.project_other"), value: "Project", default: true },
    { label: t("glossary.journal_other"), value: "Journal", default: true },
    { label: t("glossary.resource_other"), value: "Resource", default: true },
    { label: t("glossary.text_other"), value: "Text", default: true },
    { label: t("glossary.annotation_other"), value: "Annotation" },
    { label: t("glossary.full_text_other"), value: "TextSection" }
  ];

  return (
    <div ref={ref}>
      <h1 className="screen-reader-text">{t("search.title")}</h1>
      <SearchQuery.Provider>
        <Styled.FormWrapper>
          <Styled.Inner>
            <h2 className="screen-reader-text">{t("search.form")}</h2>
            <SearchQuery.Form action="/search" facets={facets} />
          </Styled.Inner>
        </Styled.FormWrapper>
        <Styled.ResultsWrapper>
          <Styled.Inner>
            <h2 className="screen-reader-text">{t("search.results")}</h2>
            <SearchResults.List
              pagination={resultsMeta?.pagination}
              paginationClickHandler={setPage}
              results={results}
              context="frontend"
            />
          </Styled.Inner>
        </Styled.ResultsWrapper>
      </SearchQuery.Provider>
    </div>
  );
});

SearchContainer.displayName = "Frontend.SearchContainer";

export default SearchContainer;
