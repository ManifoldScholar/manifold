import { useTranslation } from "react-i18next";
import { useOutletContext, useRevalidator } from "react-router";
import { resourceCollectionsAPI, projectsAPI } from "api";
import { useListQueryParams, useApiCallback } from "hooks";
import EntitiesList, {
  Search,
  ResourceRow
} from "backend/components/list/EntitiesList";
import isNil from "lodash/isNil";
import loadList from "app/routes/utility/loaders/loadList";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import { INIT_FILTERS, dynamicSearchProps } from "./filters";

const LIST_OPTIONS = {
  defaultFilters: INIT_FILTERS,
  defaultPagination: { page: 1, perPage: 5 }
};

export const loader = async ({ params, request, context }) => {
  const resourceCollection = await loadEntity({
    context,
    fetchFn: () => resourceCollectionsAPI.show(params.id),
    request
  });
  const projectId = resourceCollection.relationships.project.id;
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(projectId),
    request
  });

  const list = await loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      projectsAPI.resources(projectId, filters, pagination),
    options: LIST_OPTIONS
  });

  return { ...list, projectId, project };
};

export const clientLoader = async ({ request, serverLoader }) => {
  const serverData = await serverLoader();
  const { projectId, project } = serverData;

  const fetchFn = (filters, pagination) =>
    projectsAPI.resources(projectId, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__rcResourcesHydrated",
    fetchFn,
    options: LIST_OPTIONS
  });

  const result = await clientLoaderFn({
    request,
    serverLoader: () => serverData
  });
  return { ...result, projectId, project };
};

export default function ResourceCollectionResources({ loaderData }) {
  const { t } = useTranslation();
  const resourceCollection = useOutletContext();
  const { revalidate } = useRevalidator();

  const { data: resources, meta, project } = loaderData;

  const { resources: collectionResources } =
    resourceCollection?.relationships ?? {};

  const { searchProps, filters, setFilters } = useListQueryParams({
    initSize: 5,
    initFilters: INIT_FILTERS,
    initSearchProps: dynamicSearchProps(project)
  });

  const updateCollection = useApiCallback(resourceCollectionsAPI.update);

  const updateResources = async data => {
    const adjustedResources = data.map(r => ({
      id: r.id,
      type: r.type
    }));

    const update = {
      type: "resourceCollections",
      id: resourceCollection.id,
      relationships: { resources: { data: adjustedResources } }
    };

    await updateCollection(resourceCollection.id, update);

    revalidate();
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
