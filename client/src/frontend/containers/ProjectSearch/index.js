import { forwardRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import { useSearchResults } from "hooks/useSearch/context";
import useSearch from "hooks/useSearch";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import * as Styled from "./styles";

const ProjectSearch = forwardRef((props, ref) => {
  const { project } = useOutletContext() || {};
  const { results, resultsMeta } = useSearchResults();
  const { setPage, query, setQuery } = useSearch();

  const { t } = useTranslation();

  const projectId = project?.id ?? null;

  useEffect(() => {
    if (projectId && query.project !== projectId) {
      setQuery({ project: projectId });
    }
  }, [projectId, query.project, setQuery]);

  const facets = [
    { label: t("glossary.resource_other"), value: "Resource", default: true },
    { label: t("glossary.text_other"), value: "Text", default: true },
    { label: t("glossary.annotation_other"), value: "Annotation" },
    { label: t("glossary.full_text_one"), value: "TextSection" }
  ];

  const breadcrumbs = [
    {
      to: lh.link("frontendProjectDetail", project?.attributes?.slug),
      label: project?.attributes?.titlePlaintext
    }
  ];

  return project ? (
    <div ref={ref}>
      <CheckFrontendMode debugLabel="ProjectSearch" isProjectSubpage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <h1 className="screen-reader-text">{t("search.title")}</h1>
      <SearchQuery.Provider>
        <Styled.FormWrapper>
          <Styled.Inner>
            <h2 className="screen-reader-text">{t("search.form")}</h2>
            <SearchQuery.Form
              action={`/projects/${project?.attributes?.slug}/search`}
              facets={facets}
            />
          </Styled.Inner>
        </Styled.FormWrapper>
        <Styled.ResultsWrapper>
          <Styled.Inner>
            <h2 className="screen-reader-text">{t("search.results")}</h2>
            <SearchResults.List
              pagination={resultsMeta?.pagination}
              paginationClickHandler={setPage}
              results={results}
              hideParent
              context="frontend"
            />
          </Styled.Inner>
        </Styled.ResultsWrapper>
      </SearchQuery.Provider>
    </div>
  ) : null;
});

ProjectSearch.displayName = "Frontend.ProjectSearchContainer";

export default ProjectSearch;
