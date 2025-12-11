import { useNavigate, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import Overlay from "components/global/Overlay";
import SearchQuery from "components/global/search/query";
import SearchResults from "components/global/search/results";
import { useSearchContext } from "hooks/useSearch/context";
import searchLoader from "lib/react-router/loaders/search";

export const loader = async ({ request, context }) => {
  return searchLoader({ request, context });
};

export default function ReaderSearch({ loaderData }) {
  const { results, meta } = loaderData || {};
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { text, section } = useOutletContext();
  const { searchQueryState, setQueryState, setPage } = useSearchContext();

  const facets = [
    { label: t("reader.full_text"), value: "TextSection" },
    { label: t("glossary.annotation_title_case_other"), value: "Annotation" }
  ];

  const projectId = text.relationships.project.id;
  const textId = text.id;
  const sectionId = section.id;

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
            pagination={meta?.pagination}
            paginationClickHandler={setPage}
            results={results}
            context="project"
          />
        ) : null}
      </div>
    </Overlay>
  );
}
