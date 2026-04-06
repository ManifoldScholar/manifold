import React, { useEffect } from "react";
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
import { useFetch, useListQueryParams } from "hooks";
import { useDispatch } from "react-redux";

const { flush } = entityStoreActions;

function ProjectsListContainer({
  entitiesListSearchParams,
  entitiesListSearchProps
}) {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 20,
    initFilters: {
      ...entitiesListSearchParams.projectsList,
      withUpdateAbility: true
    },
    initSearchProps: entitiesListSearchProps("projectsList")
  });

  const { data: projects, meta: projectsMeta } = useFetch({
    request: [projectsAPI.index, filters, pagination],
    options: { requestKey: requests.beProjects }
  });

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
        search={<Search {...searchProps} />}
        buttons={[
          <Button
            path={lh.link("backendProjectsNew")}
            text={t("projects.add_button_label")}
            authorizedFor="project"
            type="add"
          />
        ]}
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
