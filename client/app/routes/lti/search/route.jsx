import { useTranslation } from "react-i18next";
import useSearch from "hooks/useSearch";
import searchLoader from "lib/react-router/loaders/search";
import SearchForm from "components/lti/Search";
import { resolveFacets } from "./filters";

export const handle = {
  breadcrumb: (match, location, t) => ({
    label: t("lti.breadcrumb.search"),
    to: "/lti/search"
  })
};

export const loader = async ({ request, context }) => {
  const facets = resolveFacets(new URL(request.url).search);
  return searchLoader({
    request,
    context,
    params: { facets }
  });
};

export const clientLoader = async ({ request }) => {
  const facets = resolveFacets(new URL(request.url).search);
  return searchLoader({
    request,
    params: { facets }
  });
};

export default function LtiSearch({ loaderData: { results, meta } }) {
  const { t } = useTranslation();
  const { searchQueryState } = useSearch();
  const { keyword } = searchQueryState;

  return (
    <>
      <h1 className="screen-reader-text">
        {keyword
          ? t("lti.search.title_with_keyword", { keyword })
          : t("lti.search.title")}
      </h1>
      <SearchForm results={results} meta={meta} keyword={keyword} />
    </>
  );
}
