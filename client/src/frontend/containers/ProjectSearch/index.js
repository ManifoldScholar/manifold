import React, { forwardRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import withSearch from "hoc/withSearch";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import * as Styled from "./styles";

const ProjectSearch = forwardRef((props, ref) => {
  const {
    results,
    resultsMeta,
    searchQueryState,
    setQueryState,
    setPage,
    project
  } = props;

  const { t } = useTranslation();

  const facets = [
    { label: t("glossary.resource_other"), value: "Resource" },
    { label: t("glossary.text_other"), value: "Text" },
    { label: t("glossary.annotation_other"), value: "Annotation" },
    { label: t("glossary.full_text_one"), value: "TextSection" }
  ];

  const breadcrumbs = useMemo(
    () => [
      {
        to: lh.link("frontendProjectDetail", project?.attributes?.slug),
        label: project?.attributes?.titlePlaintext
      }
    ],
    [project?.attributes?.titlePlaintext, project?.attributes?.slug]
  );

  return project ? (
    <div ref={ref}>
      <CheckFrontendMode debugLabel="ProjectSearch" isProjectSubpage />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <h1 className="screen-reader-text">{t("search.title")}</h1>
      <Styled.FormWrapper>
        <Styled.Inner>
          <h2 className="screen-reader-text">{t("search.form")}</h2>
          <SearchQuery.Form
            initialState={{
              keyword: "",
              scope: "project"
            }}
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
              pagination={resultsMeta.pagination}
              paginationClickHandler={setPage}
              results={results}
              hideParent
              context="frontend"
            />
          </Styled.Inner>
        </Styled.ResultsWrapper>
      )}
    </div>
  ) : null;
});

ProjectSearch.displayName = "Frontend.ProjectSearchContainer";

ProjectSearch.propTypes = {
  project: PropTypes.object.isRequired,
  results: PropTypes.array,
  resultsMeta: PropTypes.object,
  searchQueryState: PropTypes.object.isRequired,
  setQueryState: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired
};

export default withSearch(ProjectSearch);
