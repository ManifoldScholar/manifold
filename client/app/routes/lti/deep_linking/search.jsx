import { useTranslation } from "react-i18next";
import searchLoader from "lib/react-router/loaders/search";
import SearchQuery from "components/global/search/query";
import { SearchResultsProvider } from "hooks/search/useSearchResults";
import useSearch from "hooks/search/useSearch";
import SearchForm from "components/lti/Search";
import { resolveFacets } from "./filters";

export const loader = ({ url, context }) =>
  searchLoader({
    url,
    context,
    params: { facets: resolveFacets(url.search) }
  });

export default function LtiSearchRoute({ loaderData: { results, meta } }) {
  const { t } = useTranslation();
  const {
    query: { keyword }
  } = useSearch();

  return (
    <>
      <h1 className="screen-reader-text">
        {keyword
          ? t("lti.search.title_with_keyword", { keyword })
          : t("lti.search.title")}
      </h1>
      <SearchQuery.Provider>
        <SearchResultsProvider results={results} resultsMeta={meta}>
          <SearchForm />
        </SearchResultsProvider>
      </SearchQuery.Provider>
    </>
  );
}
