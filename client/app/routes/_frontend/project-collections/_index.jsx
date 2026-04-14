import { useTranslation } from "react-i18next";
import { projectCollectionsAPI } from "api";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import EntityCollectionPlaceholder from "components/global/entity/CollectionPlaceholder";
import EntityCollection from "components/frontend/entity/Collection";
import HeadContent from "components/global/HeadContent";
import { useListFilters, useListSearchParams } from "hooks";

const FILTER_RESET = { visible: "true", order: "position ASC" };
const PAGINATION_KEYS = ["page", "perPage", "collectionPage", "collectionSize"];

const OPTIONS = {
  defaultFilters: FILTER_RESET,
  paginationKeys: PAGINATION_KEYS,
  additionalPagination: {
    collectionProjects: {
      numberKey: "collectionPage",
      sizeKey: "collectionSize",
      defaultNumber: 1,
      defaultSize: 4
    }
  }
};

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });
  return loadList({
    request,
    context,
    fetchFn: projectCollectionsAPI.index,
    options: OPTIONS
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__projectCollectionsHydrated",
  fetchFn: projectCollectionsAPI.index,
  options: OPTIONS
});

export default function ProjectCollectionsRoute({ loaderData }) {
  const { data: projectCollections, meta } = loaderData;
  const { t } = useTranslation();

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: FILTER_RESET,
    paginationKeys: PAGINATION_KEYS
  });

  const showPlaceholder =
    !("keyword" in filters) && !projectCollections?.length;

  const filterProps = useListFilters({
    onFilterChange: setFilters,
    initialState: filters,
    resetState: FILTER_RESET,
    options: {
      entityType: "projectCollection",
      sort: true
    }
  });

  return (
    <>
      <HeadContent title={t("titles.project_collections")} appendDefaultTitle />
      <h1 className="screen-reader-text">{t("titles.project_collections")}</h1>
      {showPlaceholder ? (
        <EntityCollectionPlaceholder.ProjectCollectionsFrontend />
      ) : (
        <EntityCollection.ProjectCollections
          projectCollections={projectCollections}
          meta={meta}
          filterProps={filterProps}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  );
}
