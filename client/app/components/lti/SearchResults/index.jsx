import { useTranslation } from "react-i18next";
import LtiPager from "components/lti/Pager";
import SearchResultRow from "components/lti/SearchResultRow";
import * as Shared from "app/routes/lti/styles";
import * as Styled from "./styles";

export default function SearchResults({
  results,
  meta,
  keyword,
  onPageChange
}) {
  const { t } = useTranslation();
  const totalCount = meta?.pagination?.totalCount;

  if (results === null || !keyword) {
    return <Shared.Empty>{t("lti.search.empty_prompt")}</Shared.Empty>;
  }

  if (results.length === 0) {
    return (
      <Shared.Empty>{t("lti.search.no_results", { keyword })}</Shared.Empty>
    );
  }

  return (
    <>
      {typeof totalCount === "number" ? (
        <Styled.ResultsCount>
          {t("lti.search.result_count", { count: totalCount })}
        </Styled.ResultsCount>
      ) : null}
      <Shared.List>
        {results.map(result => (
          <SearchResultRow key={result.id} result={result} />
        ))}
      </Shared.List>
      <Shared.PagerWrap>
        <LtiPager meta={meta} paginationClickHandler={onPageChange} />
      </Shared.PagerWrap>
    </>
  );
}
