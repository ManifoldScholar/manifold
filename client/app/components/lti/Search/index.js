import { useTranslation } from "react-i18next";
import useSearch from "hooks/search/useSearch";
import SearchQuery from "components/global/search/query";
import Filters from "./Filters";
import SearchResults from "./Results";
import * as Styled from "./styles";

// Expects to render inside SearchQuery.Provider and SearchResultsProvider,
// both supplied by the search route.
export default function LtiSearchForm() {
  const { t } = useTranslation();
  const {
    query: { keyword }
  } = useSearch();

  return (
    <Styled.Wrapper>
      <SearchQuery.Form
        placeholder={t("search.placeholder_long")}
        autoFocus={!keyword}
      >
        <Filters />
      </SearchQuery.Form>
      <SearchResults />
    </Styled.Wrapper>
  );
}
