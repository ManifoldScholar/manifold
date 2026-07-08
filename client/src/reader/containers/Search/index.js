import { useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import Overlay from "global/components/Overlay";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import useSearch from "hooks/search/useSearch";
import { scopeToPatch } from "hooks/search/helpers";

export default function SearchContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { textId: textIdParam, sectionId: sectionIdParam } = useParams();
  const { text, section } = useOutletContext() || {};
  const { query, setQuery } = useSearch();

  const facets = [
    { label: t("reader.full_text"), value: "TextSection", default: true },
    {
      label: t("glossary.annotation_title_case_other"),
      value: "Annotation",
      default: true
    }
  ];

  const projectId = text?.relationships?.project?.id ?? null;
  const textId = text?.id ?? null;
  const sectionId = section?.id ?? null;

  const scopes = [
    sectionId && {
      label: t("glossary.chapter_one"),
      value: "section",
      paramName: "textSection",
      paramValue: sectionId
    },
    textId && {
      label: t("glossary.text_one"),
      value: "text",
      paramName: "text",
      paramValue: textId
    },
    projectId && {
      label: t("glossary.project_one"),
      value: "project",
      paramName: "project",
      paramValue: projectId
    }
  ].filter(Boolean);

  useEffect(() => {
    if (!query.scope && textId) {
      setQuery(scopeToPatch("text", scopes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.scope, textId]);

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
        <SearchQuery.Provider>
          <SearchQuery.Form
            facets={facets}
            scopes={scopes}
            className="search-query"
          />
          <SearchResults.List context="project" />
        </SearchQuery.Provider>
      </div>
    </Overlay>
  );
}

SearchContainer.displayName = "Reader.SearchContainer";
