import { useTranslation } from "react-i18next";
import { useLoaderData, useOutletContext } from "react-router";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { projectsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import searchLoader from "app/routes/utility/loaders/search";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useSearchContext } from "hooks/useSearch/context";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import * as Styled from "./styles";

export const loader = async ({ params, request, context }) => {
  // Load project to get its UUID (API expects UUID, not slug)
  const fetchFn = () => projectsAPI.show(params.id);
  const project = await loadEntity({ context, fetchFn });

  return searchLoader({
    request,
    context,
    beforeQuery: searchQueryState => {
      /* eslint-disable no-param-reassign */
      searchQueryState.project = project.id;
    }
  });
};

export default function ProjectSearch() {
  const { results, meta } = useLoaderData();
  const project = useOutletContext();
  const { searchQueryState, setQueryState, setPage } = useSearchContext();
  const { t } = useTranslation();

  const facets = [
    { label: t("glossary.resource_other"), value: "Resource" },
    { label: t("glossary.text_other"), value: "Text" },
    { label: t("glossary.annotation_other"), value: "Annotation" },
    { label: t("glossary.full_text_one"), value: "TextSection" }
  ];

  const breadcrumbs = [
    {
      to: `/projects/${project?.attributes?.slug}`,
      label: project?.attributes?.titlePlaintext
    }
  ];

  return (
    <>
      <CheckFrontendMode debugLabel="ProjectSearch" isProjectSubpage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <h1 className="screen-reader-text">{t("search.title")}</h1>
      <Styled.FormWrapper>
        <Styled.Inner>
          <h2 className="screen-reader-text">{t("search.form")}</h2>
          <SearchQuery.Form
            projectId={project.id}
            searchQueryState={searchQueryState}
            setQueryState={setQueryState}
            facets={facets}
          />
        </Styled.Inner>
      </Styled.FormWrapper>
      {results && (
        <Styled.ResultsWrapper>
          <Styled.Inner>
            <h2 className="screen-reader-text">{t("search.results")}</h2>
            <SearchResults.List
              pagination={meta?.pagination}
              paginationClickHandler={setPage}
              results={results}
              hideParent
              context="frontend"
            />
          </Styled.Inner>
        </Styled.ResultsWrapper>
      )}
    </>
  );
}
