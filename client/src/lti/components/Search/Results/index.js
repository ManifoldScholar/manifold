import { useTranslation } from "react-i18next";
import useSearch from "hooks/useSearch";
import { useSearchResults } from "hooks/useSearch/context";
import { useSearchQueryContext } from "global/components/search/query/Context";
import Pagination from "./Pagination";
import Result from "./Result";
import Order from "./Order";
import * as Styled from "./styles";

export default function SearchResults() {
  const { t } = useTranslation();
  const { results, resultsMeta: meta } = useSearchResults();
  const {
    query: { keyword }
  } = useSearch();
  const { facets } = useSearchQueryContext("LtiSearchResults");
  const totalCount = meta?.pagination?.totalCount;

  if (facets.cleared)
    return (
      <Styled.EmptyMessage>
        {t("lti.search.no_facets_selected")}
      </Styled.EmptyMessage>
    );
  if (!keyword)
    return (
      <Styled.EmptyMessage>{t("lti.search.empty_prompt")}</Styled.EmptyMessage>
    );
  // No results object yet (initial, flushed, or a pending refetch) — render
  // nothing rather than flashing a message or stale list.
  if (!results) return null;
  if (!results.length)
    return (
      <Styled.EmptyMessage>
        {t("lti.search.no_results", { keyword })}
      </Styled.EmptyMessage>
    );

  return (
    <>
      <Styled.ListHeader>
        <span>{t("lti.search.result_count", { count: totalCount })}</span>
        <Order />
      </Styled.ListHeader>
      <Styled.List>
        {results.map(result => (
          <Result
            key={result.id}
            type={result?.attributes?.searchableType}
            entity={result?.relationships?.model}
            parents={result?.attributes?.parents}
          />
        ))}
      </Styled.List>
      <Pagination meta={meta} />
    </>
  );
}
