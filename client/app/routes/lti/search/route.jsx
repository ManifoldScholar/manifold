import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { parseQueryFromUrl } from "hooks/useSearch/helpers";
import useSearch from "hooks/useSearch";
import searchLoader from "lib/react-router/loaders/search";
import FacetCheckboxes from "components/lti/FacetCheckboxes";
import SearchForm from "components/lti/SearchForm";
import SearchResults from "components/lti/SearchResults";
import * as Styled from "./styles";

const ALLOWED_FACETS = ["Project", "Text", "TextSection", "Resource"];

const FACET_VALUES = ["Project", "Text", "TextSection", "Resource"];

const FACET_LABEL_KEYS = {
  Project: "lti.facets.project",
  Text: "lti.facets.text",
  TextSection: "lti.facets.section",
  Resource: "lti.facets.resource"
};

export const handle = {
  breadcrumb: (match, location, t) => ({
    label: t("lti.breadcrumb.search"),
    to: "/lti/search"
  })
};

export const loader = async ({ request, context }) => {
  const url = new URL(request.url);
  const { facets: urlFacets } = parseQueryFromUrl(url.search);
  const requested = urlFacets.filter(f => ALLOWED_FACETS.includes(f));
  return searchLoader({
    request,
    context,
    params: {
      facets: requested.length ? requested : ALLOWED_FACETS
    }
  });
};

export default function LtiSearch({ loaderData: { results, meta } }) {
  const { t } = useTranslation();
  const { searchQueryState, setQueryState, setPage } = useSearch();
  const { keyword } = searchQueryState;
  const [draft, setDraft] = useState(keyword);

  const facetOptions = FACET_VALUES.map(value => ({
    label: t(FACET_LABEL_KEYS[value]),
    value
  }));

  useEffect(() => {
    setDraft(keyword);
  }, [keyword]);

  const urlFacets = searchQueryState.facets.filter(f =>
    ALLOWED_FACETS.includes(f)
  );

  const setFacets = nextFacets => {
    setQueryState({
      ...searchQueryState,
      facets: nextFacets,
      page: 1
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    setQueryState({
      ...searchQueryState,
      keyword: draft,
      page: 1
    });
  };

  return (
    <>
      <h1>
        {keyword ? (
          <>
            {t("lti.search.title_with_keyword")} <em>{keyword}</em>
          </>
        ) : (
          t("lti.search.title")
        )}
      </h1>
      <Styled.SearchFormWrap>
        <SearchForm
          size="md"
          placeholder={t("lti.search.placeholder")}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onSubmit={onSubmit}
          autoFocus={!keyword}
        />
      </Styled.SearchFormWrap>
      <FacetCheckboxes
        label={t("lti.facets.filter_label")}
        allLabel={t("lti.search.everything")}
        checkboxes={facetOptions}
        value={urlFacets}
        onChange={setFacets}
      />
      <SearchResults
        results={results}
        meta={meta}
        keyword={keyword}
        onPageChange={setPage}
      />
    </>
  );
}
