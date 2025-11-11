import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Overlay from "global/components/Overlay";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useSearchContext } from "hooks/useSearch/context";

export default function SearchContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { textId: textIdParam, sectionId: sectionIdParam } = useParams();
  const { text, section } = useOutletContext() || {};
  const {
    results,
    resultsMeta,
    searchQueryState,
    setQueryState,
    setPage
  } = useSearchContext();

  const facets = [
    { label: t("reader.full_text"), value: "TextSection" },
    { label: t("glossary.annotation_title_case_other"), value: "Annotation" }
  ];

  const projectId = text?.relationships?.project?.id ?? null;
  const textId = text?.id ?? null;
  const sectionId = section?.id ?? null;

  const close = () => {
    const finalTextId = textId || textIdParam;
    const finalSectionId = sectionId || sectionIdParam;
    if (finalTextId && finalSectionId) {
      navigate(lh.link("readerSection", finalTextId, finalSectionId), {
        state: { noScroll: true }
      });
    } else {
      navigate(lh.link("reader", finalTextId), { state: { noScroll: true } });
    }
  };

  return (
    <Overlay
      open
      closeCallback={close}
      title={t("search.results")}
      icon={"search24"}
      contentWidth={850}
      appearance="overlay-full bg-white"
    >
      <div>
        <SearchQuery.Form
          searchQueryState={searchQueryState}
          setQueryState={setQueryState}
          facets={facets}
          projectId={projectId}
          textId={textId}
          sectionId={sectionId}
        />
        {results ? (
          <SearchResults.List
            pagination={resultsMeta.pagination}
            paginationClickHandler={setPage}
            results={results}
            context="project"
          />
        ) : null}
      </div>
    </Overlay>
  );
}

SearchContainer.displayName = "Reader.SearchContainer";
