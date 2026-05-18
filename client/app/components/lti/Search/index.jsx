import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigation } from "react-router";
import useSearch from "hooks/useSearch";
import SearchQuery from "components/global/search/query";
import Filters from "./Filters";
import SearchResults from "./Results";
import { resolveFacets } from "routes/lti/search/filters";
import * as Styled from "./styles";

export default function LtiSearchForm({ ...resultsProps }) {
  const { t } = useTranslation();
  const { searchQueryState, setQuery } = useSearch();
  const { keyword } = searchQueryState;
  const location = useLocation();
  const navigation = useNavigation();
  const formRef = useRef(null);
  const [facetsCleared, setFacetsCleared] = useState(false);
  const [awaitingResults, setAwaitingResults] = useState(false);

  // Since clearing facets blocks form submission, wait to hide
  // the facets cleared message until we have new results
  useEffect(() => {
    if (!facetsCleared) return;

    if (navigation.state === "loading") return setAwaitingResults(true);
    if (navigation.state === "idle" && awaitingResults) {
      setAwaitingResults(false);
      setFacetsCleared(false);
    }
  }, [navigation.state, awaitingResults, facetsCleared]);

  const urlFacets = resolveFacets(location.search);
  const filterValue = facetsCleared ? [] : urlFacets;

  const setFacets = nextFacets => {
    if (!nextFacets.length) {
      setFacetsCleared(true);
      setAwaitingResults(false);
      return;
    }
    if (formRef.current) formRef.current.requestSubmit();
  };

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const facets = formData.getAll("facet");
    if (facetsCleared && !facets.length) return;
    setQuery({ keyword: formData.get("keyword") ?? "", facets });
  };

  return (
    <Styled.Wrapper>
      <SearchQuery.Form
        ref={formRef}
        onSubmit={handleSubmit}
        placeholder={t("search.placeholder_long")}
        autoFocus={!keyword}
      >
        <Filters value={filterValue} onChange={setFacets} />
      </SearchQuery.Form>
      <SearchResults facetsCleared={facetsCleared} {...resultsProps} />
    </Styled.Wrapper>
  );
}

LtiSearchForm.propTypes = {
  results: PropTypes.array,
  meta: PropTypes.object,
  keyword: PropTypes.string
};
