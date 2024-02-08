import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { entityStoreActions } from "actions";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { projectFilters } from "hoc/withFilteredLists";
import {
  useFetch,
  usePaginationState,
  useFromStore,
  useSetLocation
} from "hooks";
import { useDispatch } from "react-redux";

const { flush } = entityStoreActions;

function ProjectsListContainer({
  savedSearchPaginationState,
  saveSearchState,
  entitiesListSearchParams,
  entitiesListSearchProps
}) {
  const authentication = useFromStore("authentication");
  const { currentUser } = authentication ?? {};

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { number, size, collectionProjects } =
    savedSearchPaginationState("projectsList") ?? {};

  const [pagination, setPageNumber] = usePaginationState(
    number,
    size,
    collectionProjects
  );

  const filters = useMemo(() => {
    return {
      ...entitiesListSearchParams.projectsList,
      withUpdateAbility:
        currentUser?.attributes?.abilities?.viewDrafts || undefined
    };
  }, [entitiesListSearchParams.projectsList, currentUser]);

  const { data: projects, meta: projectsMeta } = useFetch({
    request: [projectsAPI.index, filters, pagination],
    options: { requestKey: requests.beProjects }
  });

  useSetLocation({ filters, page: pagination.number });

  useEffect(() => {
    if (saveSearchState) saveSearchState("projectsList", pagination);
  }, [pagination, saveSearchState]);

  useEffect(() => {
    return () => dispatch(flush(requests.beProjects));
  }, [dispatch]);

  if (!projectsMeta || !projects) return null;

  const { totalCount } = projectsMeta.pagination ?? {};

  return (
    <>
      <HeadContent
        title={`${t("titles.projects")} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <EntitiesList
        entityComponent={ProjectRow}
        listStyle="grid"
        title={t("glossary.project_title_case", { count: totalCount })}
        titleStyle="bar"
        titleIcon="BEProject64"
        entities={projects}
        unit={t("glossary.project", { count: totalCount })}
        pagination={projectsMeta.pagination}
        showCountInTitle
        showCount
        callbacks={{
          onPageClick: page => e => {
            e.preventDefault();
            setPageNumber(page);
          }
        }}
        search={<Search {...entitiesListSearchProps("projectsList")} />}
        buttons={[
          <Button
            path={lh.link("backendProjectsNew")}
            text={t("projects.add_button_label")}
            authorizedFor="project"
            type="add"
          />
        ]}
        usesQueryParams
      />
    </>
  );
}

ProjectsListContainer.displayName = "Projects.List";

ProjectsListContainer.propTypes = {
  savedSearchPaginationState: PropTypes.func.isRequired,
  saveSearchState: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};

export default withFilteredLists(ProjectsListContainer, {
  projectsList: projectFilters({ snapshotState: true })
});
