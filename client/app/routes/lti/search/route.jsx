import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { parseQueryFromUrl } from "hooks/useSearch/helpers";
import useSearch from "hooks/useSearch";
import searchLoader from "lib/react-router/loaders/search";
import FacetCheckboxes from "components/lti/FacetCheckboxes";
import SearchQuery from "components/global/search/query";
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
  const { searchQueryState, setQuery, setPage } = useSearch();
  const { keyword } = searchQueryState;

  const facetOptions = FACET_VALUES.map(value => ({
    label: t(FACET_LABEL_KEYS[value]),
    value
  }));

  const urlFacets = searchQueryState.facets.filter(f =>
    ALLOWED_FACETS.includes(f)
  );

  const formRef = useRef(null);

  // Read the in-flight keyword from the form so toggling a facet doesn't
  // clobber what the user has typed but not submitted.
  const setFacets = nextFacets => {
    const form = formRef.current;
    const draft = form ? new FormData(form).get("keyword") ?? "" : keyword;
    setQuery({ facets: nextFacets, keyword: draft });
  };

  return (
    <>
      <h1 className="screen-reader-text">
        {keyword ? (
          <>
            {t("lti.search.title_with_keyword")} <em>{keyword}</em>
          </>
        ) : (
          t("lti.search.title")
        )}
      </h1>
      <Styled.SearchFormWrap>
        <SearchQuery.Form
          ref={formRef}
          action="/lti/search"
          placeholder={t("search.placeholder_long")}
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
