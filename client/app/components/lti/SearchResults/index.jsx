import { useTranslation } from "react-i18next";
import Pagination from "./Pagination";
import Result from "./Result";
import Order from "./Order";
import * as Styled from "./styles";

export default function SearchResults({
  results,
  meta,
  keyword,
  facetsCleared
}) {
  const { t } = useTranslation();
  const totalCount = meta?.pagination?.totalCount;

  /* eslint-disable no-nested-ternary */
  const emptyMessage = facetsCleared
    ? t("lti.search.no_facets_selected")
    : !results || !keyword
    ? t("lti.search.empty_prompt")
    : !results?.length
    ? t("lti.search.no_results", { keyword })
    : null;

  if (emptyMessage) {
    return <Styled.EmptyMessage>{emptyMessage}</Styled.EmptyMessage>;
  }

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
