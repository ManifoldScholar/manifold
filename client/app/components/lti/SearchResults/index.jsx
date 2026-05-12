import { useTranslation } from "react-i18next";
import LtiPager from "components/lti/Pager";
import Result from "./Result";
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
    return <Styled.Empty>{t("lti.search.empty_prompt")}</Styled.Empty>;
  }

  if (results.length === 0) {
    return (
      <Styled.Empty>{t("lti.search.no_results", { keyword })}</Styled.Empty>
    );
  }

  return (
    <>
      {typeof totalCount === "number" ? (
        <Styled.ResultsCount>
          {t("lti.search.result_count", { count: totalCount })}
        </Styled.ResultsCount>
      ) : null}
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
      <Styled.PagerWrap>
        <LtiPager meta={meta} paginationClickHandler={onPageChange} />
      </Styled.PagerWrap>
    </>
  );
}
