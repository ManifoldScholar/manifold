import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useSearch from "hooks/useSearch";
import SearchQuery from "global/components/search/query";
import Filters from "./Filters";
import SearchResults from "./Results";
import * as Styled from "./styles";

export default function LtiSearchForm({ ...resultsProps }) {
  const { t } = useTranslation();
  const { query } = useSearch();
  const { keyword } = query;

  return (
    <SearchQuery.Provider>
      <Styled.Wrapper>
        <SearchQuery.Form
          placeholder={t("search.placeholder_long")}
          autoFocus={!keyword}
        >
          <Filters />
        </SearchQuery.Form>
        <SearchResults {...resultsProps} />
      </Styled.Wrapper>
    </SearchQuery.Provider>
  );
}

LtiSearchForm.propTypes = {
  results: PropTypes.array,
  meta: PropTypes.object,
  keyword: PropTypes.string
};
