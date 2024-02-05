import React, { useMemo } from "react";
import EntitiesList, {
  Button,
  Search,
  ProjectRow,
  JournalRow
} from "backend/components/list/EntitiesList";
import lh from "helpers/linkHandler";
import { useFetch, usePaginationState, useAuthentication } from "hooks";
import { projectsAPI, journalsAPI } from "api";
import withFilteredLists, {
  projectFilters,
  journalFilters
} from "hoc/withFilteredLists";
import Authorize from "hoc/Authorize";
import DashboardComponents from "backend/components/dashboard";
import PageHeader from "backend/components/layout/PageHeader";
import Authorization from "helpers/authorization";
import isEqual from "lodash/isEqual";
import { useTranslation } from "react-i18next";

export function DashboardsAdminContainer({
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const [projectsPagination, setProjectsPageNumber] = usePaginationState(1, 5);
  const [journalsPagination, setJournalsPageNumber] = usePaginationState(1, 5);

  const authentication = useAuthentication();

  const projectFiltersWithDefaults = useMemo(
    () => ({
      withUpdateAbility: true,
      ...entitiesListSearchParams.projects
    }),
    [entitiesListSearchParams?.projects]
  );

  const journalFiltersWithDefaults = useMemo(
    () => ({
      withUpdateOrIssueUpdateAbility: true,
      ...entitiesListSearchParams.journals
    }),
    [entitiesListSearchParams?.journals]
  );

  const { data: projects, meta: projectsMeta } = useFetch({
    request: [projectsAPI.index, projectFiltersWithDefaults, projectsPagination]
  });

  const { data: journals, meta: journalsMeta } = useFetch({
    request: [journalsAPI.index, journalFiltersWithDefaults, journalsPagination]
  });

  const authorization = new Authorization();
  const canCreateProjects = authorization.authorizeAbility({
    authentication,
    entity: "project",
    ability: "create"
  });

  const { t } = useTranslation();

  const noProjects =
    isEqual(
      entitiesListSearchParams?.projects,
      entitiesListSearchParams?.initialProjects
    ) && canCreateProjects
      ? t("dashboard.empty_message_creator")
      : t("dashboard.empty_message_generic");

  if (!projects) return null;

  const projectList =
    projects && projectsMeta ? (
      <div className="dashboard-panel">
        <div className="panel">
          <EntitiesList
            entities={projects}
            entityComponent={ProjectRow}
            entityComponentProps={{
              placeholderMode: "small"
            }}
            title={t("glossary.project_title_case", {
              count: projectsMeta?.pagination?.totalCount
            })}
            titleLink={lh.link("backendProjects")}
            titleIcon="BEProject64"
            titleStyle="bar"
            titleTag="h2"
            showCount
            showCountInTitle
            unit={t("glossary.project", {
              count: projectsMeta?.pagination?.totalCount
            })}
            pagination={projectsMeta.pagination}
            paginationPadding={1}
            callbacks={{
              onPageClick: page => () => setProjectsPageNumber(page)
            }}
            emptyMessage={noProjects}
            search={
              <Search
                searchStyle="vertical"
                onFilterChange={() => setProjectsPageNumber(1)}
                {...entitiesListSearchProps("projects")}
              />
            }
            buttons={[
              <Button
                path={lh.link("backendProjectsNew")}
                text={t("projects.add_button_label")}
                authorizedFor="project"
                authorizedTo="create"
                type="add"
              />
            ]}
          />
        </div>
      </div>
    ) : null;

  const journalList =
    journals && journalsMeta ? (
      <div className="dashboard-panel">
        <div className="panel">
          <EntitiesList
            entities={journals}
            entityComponent={JournalRow}
            entityComponentProps={{
              placeholderMode: "small"
            }}
            title={t("glossary.journal_title_case", {
              count: journalsMeta?.pagination?.totalCount
            })}
            titleLink={lh.link("backendJournals")}
            titleIcon="Journals64"
            titleStyle="bar"
            titleTag="h2"
            showCount
            showCountInTitle
            unit={t("glossary.journal", {
              count: journalsMeta?.pagination?.totalCount
            })}
            pagination={journalsMeta.pagination}
            paginationPadding={1}
            callbacks={{
              onPageClick: page => () => setJournalsPageNumber(page)
            }}
            search={
              <Search
                searchStyle="vertical"
                onFilterChange={() => setJournalsPageNumber(1)}
                {...entitiesListSearchProps("journals")}
              />
            }
            buttons={[
              <Button
                path={lh.link("backendJournalsNew")}
                text={t("journals.add_button_label")}
                authorizedFor="journal"
                authorizedTo="create"
                type="add"
              />
            ]}
          />
        </div>
      </div>
    ) : null;

  const analytics = (
    <Authorize entity="statistics" ability={"read"}>
      <PageHeader
        type="analytics"
        link={{
          path: lh.link("backendAnalytics"),
          label: t("actions.see_all")
        }}
        titleTag="h2"
        title={t("analytics.global_header")}
      />

      <DashboardComponents.Analytics />
    </Authorize>
  );

  const canSeeAnalytics = authorization.authorizeAbility({
    authentication,
    entity: "statistics",
    ability: "read"
  });

  const guts = canSeeAnalytics ? (
    <>
      <div className="left">
        {projectList}
        {journalList}
      </div>
      <div className="right">{analytics}</div>
    </>
  ) : (
    <>
      <div className="left">{projectList}</div>
      <div className="right">{journalList}</div>
    </>
  );

  return (
    <main id="skip-to-main" tabIndex={-1}>
      <h1 className="screen-reader-text">{t("dashboard.title")}</h1>
      <section>
        <div className="container">
          <section className="backend-dashboard">{guts}</section>
        </div>
      </section>
    </main>
  );
}
export default withFilteredLists(DashboardsAdminContainer, {
  projects: projectFilters({ snapshotState: true }),
  journals: journalFilters({ snapshotState: true })
});
