import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import useSearch from "hooks/useSearch";
import { useSearchResults } from "hooks/useSearch/context";
import SearchForm from "lti/components/Search";
import { resolveFacets } from "./filters";

export default function LtiSearch() {
  const { t } = useTranslation();
  const location = useLocation();
  const { query, setQuery } = useSearch();
  const { keyword } = query;
  const { results, resultsMeta } = useSearchResults();

  // Seed the LTI-scoped default facets (Project, Text) into the query when the
  // URL carries none, so the fetched results match what the Filters display.
  // Replaces the framework-mode loader's resolveFacets injection.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (!params.has("facets")) {
      setQuery({ facets: resolveFacets(location.search) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <>
      <h1 className="screen-reader-text">
        {keyword
          ? t("lti.search.title_with_keyword", { keyword })
          : t("lti.search.title")}
      </h1>
      <SearchForm results={results} meta={resultsMeta} keyword={keyword} />
    </>
  );
}

LtiSearch.displayName = "Lti.SearchContainer";
