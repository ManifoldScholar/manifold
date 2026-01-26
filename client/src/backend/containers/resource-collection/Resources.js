import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { resourceCollectionsAPI, projectsAPI, requests } from "api";
import { useListQueryParams, useFetch, useApiCallback } from "hooks";
import EntitiesList, {
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { resourceFilters } from "hoc/withFilteredLists";
import isNil from "lodash/isNil";

function ResourceCollectionResourcesContainer({
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();
  const { resourceCollection } = useOutletContext();

  const { project, resources: collectionResources } =
    resourceCollection?.relationships ?? {};

  const { pagination, filters, setFilters, searchProps } = useListQueryParams({
    initSize: 5,
    initFilters: entitiesListSearchParams.resources,
    initSearchProps: resourceFilters.dynamicParams(
      entitiesListSearchProps("resources"),
      project
    )
  });

  const { data: resources, meta, refresh } = useFetch({
    request: [projectsAPI.resources, project.id, filters, pagination],
    dependencies: [filters],
    options: { requestKey: requests.beResources }
  });

  const updateCollection = useApiCallback(resourceCollectionsAPI.update);

  if (!resourceCollection) return null;

  const updateResources = async data => {
    const adjustedResources = data.map(r => {
      return {
        id: r.id,
        type: r.type
      };
    });

    const update = {
      type: "resourceCollections",
      id: resourceCollection.id,
      relationships: { resources: { data: adjustedResources } }
    };

    await updateCollection(resourceCollection.id, update);

    refresh();
  };

  const addRemoveResource = (event, resource) => {
    event.preventDefault();

    const isInCollection = !!collectionResources.find(
      r => r.id === resource.id
    );

    if (isInCollection) {
      const update = collectionResources.filter(r => r.id !== resource.id);
      return updateResources(update);
    }

    const update = [...collectionResources, resource];
    return updateResources(update);
  };

  const toggleCollectionOnly = event => {
    event.preventDefault();

    setFilters({
      ...filters,
      resourceCollection: filters.resourceCollection
        ? null
        : resourceCollection.id
    });
  };

  const collectionFilterEnabled = !isNil(filters.resourceCollection);

  const toggleLabel = collectionFilterEnabled
    ? "resource_collections.show_all_projects"
    : "resource_collections.show_collection_projects";

  return resources ? (
    <EntitiesList
      entityComponent={ResourceRow}
      entityComponentProps={{
        showSwitch: true,
        onSwitchChange: addRemoveResource,
        switchValue: id => !!collectionResources.find(r => r.id === id)
      }}
      title={t("glossary.resource_title_case_other")}
      titleStyle="bar"
      titleTag="h2"
      titleActions={[
        {
          label: toggleLabel,
          onClick: toggleCollectionOnly,
          icon: collectionFilterEnabled ? "circlePlus24" : "circleMinus24"
        }
      ]}
      entities={resources}
      unit={t("glossary.resource", {
        count: meta?.pagination?.totalCount
      })}
      pagination={meta?.pagination}
      showCount
      search={<Search {...searchProps} />}
    />
  ) : null;
}

export default withFilteredLists(ResourceCollectionResourcesContainer, {
  resources: resourceFilters.defaultParams()
});

ResourceCollectionResourcesContainer.displayName =
  "ResourceCollection.Resources";
