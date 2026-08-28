import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import Overlay from "components/global/Overlay";
import SearchQuery from "components/global/search/query";
import SearchResults from "components/global/search/results";
import useSearch from "hooks/search/useSearch";
import { scopeToPatch } from "hooks/search/helpers";
import { SearchResultsProvider } from "hooks/search/useSearchResults";
import searchLoader from "lib/react-router/loaders/search";

export const loader = async ({ url, context }) => {
  return searchLoader({ url, context });
};

export default function ReaderSearch({ loaderData }) {
  const { results, meta } = loaderData || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { text, section } = useOutletContext();
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

  // Default to searching the whole text when no scope is in the URL yet.
  useEffect(() => {
    if (!query.scope && textId) {
      setQuery(scopeToPatch("text", scopes));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.scope, textId]);

  const close = () => {
    navigate(`/read/${textId}/section/${sectionId}`, {
      state: { noScroll: true }
    });
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
          <SearchResultsProvider results={results} resultsMeta={meta}>
            <SearchQuery.Form
              facets={facets}
              scopes={scopes}
              className="search-query"
            />
            <SearchResults.List context="project" />
          </SearchResultsProvider>
        </SearchQuery.Provider>
      </div>
    </Overlay>
  );
}
