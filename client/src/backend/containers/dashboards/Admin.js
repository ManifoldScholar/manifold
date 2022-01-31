import React, { useCallback } from "react";
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
import Layout from "backend/components/layout";
import Authorization from "helpers/authorization";
import isEqual from "lodash/isEqual";

export function DashboardsAdminContainer({
  entitiesListSearchProps,
  entitiesListSearchParams,
  saveSearchState,
  savedSearchPaginationState
}) {
  const {
    number: projectPageNumber,
    size: projectPageSize
  } = savedSearchPaginationState("projects") || { number: 1, size: 10 };
  const {
    number: journalPageNumber,
    size: journalPageSize
  } = savedSearchPaginationState("journals") || { number: 1, size: 10 };

  const [projectsPagination, setProjectsPageNumber] = usePaginationState(
    projectPageNumber,
    projectPageSize
  );
  const [journalsPagination, setJournalsPageNumber] = usePaginationState(
    journalPageNumber,
    journalPageSize
  );

  const authentication = useAuthentication();

  const saveProjectsSearch = useCallback(() => {
    saveSearchState("projects", projectsPagination);
  }, [saveSearchState, projectsPagination]);

  const saveJournalsSearch = useCallback(() => {
    saveSearchState("journals", journalsPagination);
  }, [saveSearchState, journalsPagination]);

  const { data: projects, meta: projectsMeta } = useFetch({
    request: [
      projectsAPI.index,
      entitiesListSearchParams?.projects,
      projectsPagination
    ],
    afterFetch: saveProjectsSearch
  });

  const { data: journals, meta: journalsMeta } = useFetch({
    request: [
      journalsAPI.index,
      entitiesListSearchParams?.journals,
      journalsPagination
    ],
    afterFetch: saveJournalsSearch
  });

  const authorization = new Authorization();
  const canCreateProjects = authorization.authorizeAbility({
    authentication,
    entity: "project",
    ability: "create"
  });

  const noProjects =
    isEqual(
      entitiesListSearchParams?.projects,
      entitiesListSearchParams?.initialProjects
    ) && canCreateProjects
      ? "This Manifold Library is empty. Click the button above to create your first project."
      : "Sorry, no results were found.";

  if (!projects) return null;
  return (
    <main id="skip-to-main">
      <h1 className="screen-reader-text">Dashboard</h1>
      <section>
        <div className="container">
          <section className="backend-dashboard">
            <div className="left">
              {projects && projectsMeta && (
                <div className="dashboard-panel">
                  <div className="panel">
                    <EntitiesList
                      entities={projects}
                      entityComponent={ProjectRow}
                      entityComponentProps={{
                        placeholderMode: "small"
                      }}
                      title={
                        projectsMeta?.pagination?.totalCount !== 1
                          ? "Projects"
                          : "Project"
                      }
                      titleLink={lh.link("backendProjects")}
                      titleIcon="BEProject64"
                      titleStyle="bar"
                      titleTag="h2"
                      showCount
                      showCountInTitle
                      unit="project"
                      pagination={projectsMeta.pagination}
                      callbacks={{
                        onPageClick: page => () => setProjectsPageNumber(page)
                      }}
                      emptyMessage={noProjects}
                      search={
                        <Search
                          searchStyle="vertical"
                          {...entitiesListSearchProps("projects")}
                        />
                      }
                      buttons={[
                        <Button
                          path={lh.link("backendProjectsNew")}
                          text="Add a new project"
                          authorizedFor="project"
                          authorizedTo="create"
                          type="add"
                        />
                      ]}
                    />
                  </div>
                </div>
              )}
              {journals && journalsMeta && (
                <div className="dashboard-panel">
                  <div className="panel">
                    <EntitiesList
                      entities={journals}
                      entityComponent={JournalRow}
                      entityComponentProps={{
                        placeholderMode: "small"
                      }}
                      title={
                        journalsMeta?.pagination?.totalCount !== 1
                          ? "Journals"
                          : "Journal"
                      }
                      titleLink={lh.link("backendJournals")}
                      titleIcon="Journals64"
                      titleStyle="bar"
                      titleTag="h2"
                      showCount
                      showCountInTitle
                      unit="journal"
                      pagination={journalsMeta.pagination}
                      callbacks={{
                        onPageClick: page => () => setJournalsPageNumber(page)
                      }}
                      search={
                        <Search
                          searchStyle="vertical"
                          {...entitiesListSearchProps("journals")}
                        />
                      }
                      buttons={[
                        <Button
                          path={lh.link("backendJournalsNew")}
                          text="Add a new journal"
                          authorizedFor="journal"
                          authorizedTo="create"
                          type="add"
                        />
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="right">
              <Authorize entity="statistics" ability={"read"}>
                <Layout.ViewHeader
                  spaceBottom
                  icon="BEAnalytics64"
                  iconAltAccented
                  link={{
                    path: lh.link("backendAnalytics"),
                    label: "see all"
                  }}
                  titleTag="h2"
                >
                  Analytics
                </Layout.ViewHeader>
                <DashboardComponents.Analytics />
              </Authorize>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
export default withFilteredLists(DashboardsAdminContainer, {
  projects: projectFilters({ snapshotState: true }),
  journals: journalFilters({ snapshotState: true })
});
