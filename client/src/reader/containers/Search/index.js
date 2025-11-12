import { useMemo } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom-v5-compat";
import lh from "helpers/linkHandler";
import Overlay from "global/components/Overlay";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useSearchContext } from "hooks/useSearch/context";

export default function SearchContainer({ text, section }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { textId: textIdParam, sectionId: sectionIdParam } = useParams();
  const {
    results,
    resultsMeta,
    searchQueryState,
    setQueryState,
    setPage
  } = useSearchContext();

  const facets = useMemo(
    () => [
      { label: t("reader.full_text"), value: "TextSection" },
      {
        label: t("glossary.annotation_title_case_other"),
        value: "Annotation"
      }
    ],
    [t]
  );

  const projectId = useMemo(() => {
    if (!text) return null;
    return text.relationships.project.id;
  }, [text]);

  const textId = useMemo(() => {
    if (!text) return null;
    return text.id;
  }, [text]);

  const sectionId = useMemo(() => {
    if (!section) return null;
    return section.id;
  }, [section]);

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

SearchContainer.propTypes = {
  text: PropTypes.object,
  section: PropTypes.object
};
