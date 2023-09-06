import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { resourceFilters } from "hoc/withFilteredLists";
import { usePaginationState, useSetLocation, useFetch } from "hooks";

function ProjectResourcesListContainer({
  project,
  entitiesListSearchParams,
  entitiesListSearchProps
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: resources, meta: resourcesMeta } = useFetch({
    request: [
      projectsAPI.resources,
      project.id,
      entitiesListSearchParams.resources,
      pagination
    ],
    options: { requestKey: requests.beResources }
  });

  useSetLocation({
    filters: entitiesListSearchParams.resources,
    page: pagination.number
  });

  if (!resources || !resourcesMeta) return null;

  return (
    <EntitiesList
      entityComponent={ResourceRow}
      title={t("projects.manage_resources")}
      titleStyle="bar"
      titleTag="h2"
      entities={resources}
      unit={t("glossary.resource", {
        count: resourcesMeta?.pagination?.totalCount
      })}
      pagination={resourcesMeta.pagination}
      showCount
      callbacks={{
        onPageClick: page => e => {
          e.preventDefault();
          setPageNumber(page);
        }
      }}
      search={
        <Search
          {...resourceFilters.dynamicParams(
            entitiesListSearchProps("resources"),
            project
          )}
        />
      }
      buttons={[
        <Button
          path={lh.link("backendProjectResourcesNew", project.id)}
          text={t("resources.add_button_label")}
          authorizedFor={project}
          authorizedTo="createResources"
          type="add"
        />,
        <Button
          path={lh.link("backendResourceImport", project.id)}
          text={t("resources.bulk_add_label")}
          authorizedFor={project}
          authorizedTo="createResources"
          icon="BEResourcesBoxes64"
        />
      ]}
      usesQueryParams
    />
  );
}

ProjectResourcesListContainer.displayName = "Project.ResourcesList";

ProjectResourcesListContainer.propTypes = {
  project: PropTypes.object
};

export default withFilteredLists(ProjectResourcesListContainer, {
  resources: resourceFilters.defaultParams()
});
