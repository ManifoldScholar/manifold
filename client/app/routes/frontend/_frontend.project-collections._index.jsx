import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { ApiClient, projectCollectionsAPI } from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "helpers/router/loaders/checkLibraryMode";
import createListClientLoader from "helpers/router/loaders/createListClientLoader";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useListSearchParams } from "hooks";

export { shouldRevalidate } from "helpers/router/shouldRevalidate";

const FILTER_RESET = { visible: "true", order: "position ASC" };
const PAGINATION_KEYS = ["page", "perPage", "collectionPage", "collectionSize"];

// Custom parser needed: project collections have nested pagination for collection projects
const parseParams = url => {
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const perPage = parseInt(url.searchParams.get("perPage") || "20", 10);
  const collectionPage = parseInt(
    url.searchParams.get("collectionPage") || "1",
    10
  );
  const collectionSize = parseInt(
    url.searchParams.get("collectionSize") || "4",
    10
  );

  const filters = { ...FILTER_RESET };
  Array.from(url.searchParams.entries()).forEach(([key, value]) => {
    if (!PAGINATION_KEYS.includes(key)) {
      filters[key] = value;
    }
  });

  return {
    filters,
    pagination: {
      number: page,
      size: perPage,
      collectionProjects: {
        size: collectionSize,
        number: collectionPage
      }
    }
  };
};

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });

  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const url = new URL(request.url);
  const { filters, pagination } = parseParams(url);

  const result = await client.call(
    projectCollectionsAPI.index(filters, pagination)
  );

  return {
    projectCollections: result ?? [],
    collectionsMeta: result?.meta ?? null
  };
};

export const clientLoader = createListClientLoader(
  "__projectCollectionsHydrated",
  async (filters, pagination) => {
    const client = new ApiClient(null, { denormalize: true });
    const result = await client.call(
      projectCollectionsAPI.index(filters, pagination)
    );
    return {
      projectCollections: result ?? [],
      collectionsMeta: result?.meta ?? null
    };
  },
  parseParams
);

export default function ProjectCollectionsRoute() {
  const { projectCollections, collectionsMeta } = useLoaderData();
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
      <CheckFrontendMode debugLabel="ProjectCollections" isProjectSubpage />
      <h1 className="screen-reader-text">{t("titles.project_collections")}</h1>
      {showPlaceholder ? (
        <EntityCollectionPlaceholder.ProjectCollectionsFrontend />
      ) : (
        <EntityCollection.ProjectCollections
          projectCollections={projectCollections}
          meta={collectionsMeta}
          filterProps={filterProps}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  );
}
