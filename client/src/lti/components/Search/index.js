import { useTranslation } from "react-i18next";
import useSearch from "hooks/useSearch";
import SearchQuery from "global/components/search/query";
import Filters from "./Filters";
import SearchResults from "./Results";
import * as Styled from "./styles";

export default function LtiSearchForm() {
  const { t } = useTranslation();
  const {
    query: { keyword }
  } = useSearch();

  return (
    <SearchQuery.Provider>
      <Styled.Wrapper>
        <SearchQuery.Form
          placeholder={t("search.placeholder_long")}
          autoFocus={!keyword}
        >
          <Filters />
        </SearchQuery.Form>
        <SearchResults />
      </Styled.Wrapper>
    </SearchQuery.Provider>
  );
}
