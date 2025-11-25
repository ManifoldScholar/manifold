import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, {
  resourceCollectionFilters
} from "hoc/withFilteredLists";
import { useListQueryParams, useFetch } from "hooks";

function ProjectResourceCollectionsListContainer({
  project,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.resourceCollections,
    initSearchProps: entitiesListSearchProps("resourceCollections")
  });

  const { data: resourceCollections, meta: resourceCollectionsMeta } = useFetch(
    {
      request: [
        projectsAPI.resourceCollections,
        project.id,
        filters,
        pagination
      ],
      options: { requestKey: requests.beResourceCollections }
    }
  );

  if (!resourceCollections || !resourceCollectionsMeta) return null;

  return (
    <EntitiesList
      entityComponent={ResourceCollectionRow}
      title={t("projects.manage_resource_collections")}
      titleStyle="bar"
      titleTag="h2"
      entities={resourceCollections}
      unit={t("glossary.resource_collection", {
        count: resourceCollectionsMeta?.pagination?.totalCount
      })}
      pagination={resourceCollectionsMeta.pagination}
      showCount
      search={<Search {...searchProps} />}
      buttons={[
        <Button
          path={lh.link("backendProjectResourceCollectionsNew", project.id)}
          text={t("resource_collections.add_button_label")}
          authorizedFor={project}
          authorizedTo="createResourceCollections"
          type="add"
        />
      ]}
    />
  );
}

ProjectResourceCollectionsListContainer.displayName = "Project.CollectionsList";

ProjectResourceCollectionsListContainer.propTypes = {
  project: PropTypes.object,
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withFilteredLists(ProjectResourceCollectionsListContainer, {
  resourceCollections: resourceCollectionFilters()
});
