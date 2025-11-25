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
import { useListQueryParams, useFetch } from "hooks";

function ProjectResourcesListContainer({
  project,
  entitiesListSearchParams,
  entitiesListSearchProps
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.resources,
    initSearchProps: resourceFilters.dynamicParams(
      entitiesListSearchProps("resources"),
      project
    )
  });

  const { data: resources, meta: resourcesMeta } = useFetch({
    request: [projectsAPI.resources, project.id, filters, pagination],
    options: { requestKey: requests.beResources }
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
      search={<Search {...searchProps} />}
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
