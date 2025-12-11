import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { ApiClient, projectsAPI } from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "helpers/router/loaders/checkLibraryMode";
import parseListParams from "helpers/router/loaders/parseListParams";
import createListClientLoader from "helpers/router/loaders/createListClientLoader";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "helpers/router/shouldRevalidate";

const FILTER_RESET = { standaloneModeEnforced: "false" };

const parseParams = url =>
  parseListParams(url, { defaultFilters: FILTER_RESET });

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });

  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const url = new URL(request.url);
  const { filters, pagination } = parseParams(url);

  const result = await client.call(projectsAPI.index(filters, pagination));

  return {
    projects: result ?? [],
    projectsMeta: result?.meta ?? null
  };
};

export const clientLoader = createListClientLoader(
  "__projectsHydrated",
  async (filters, pagination) => {
    const client = new ApiClient(null, { denormalize: true });
    const result = await client.call(projectsAPI.index(filters, pagination));
    return { projects: result ?? [], projectsMeta: result?.meta ?? null };
  },
  parseParams
);

export default function ProjectsRoute() {
  const { projects, projectsMeta } = useLoaderData();
  const subjects = useSubjects();
  const { t } = useTranslation();

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: FILTER_RESET
  });

  const showPlaceholder =
    !("keyword" in filters) && !("featured" in filters) && !projects?.length;

  const filterProps = useListFilters({
    onFilterChange: setFilters,
    initialState: filters,
    resetState: FILTER_RESET,
    options: {
      entityType: "project",
      sort: true,
      subjects,
      featured: true,
      featuredLabel: t("filters.featured_projects")
    }
  });

  return (
    <>
      <HeadContent title={t("titles.projects")} appendDefaultTitle />
      <h1 className="screen-reader-text">{t("titles.projects")}</h1>
      {showPlaceholder ? (
        <EntityCollectionPlaceholder.Projects />
      ) : (
        <EntityCollection.Projects
          projects={projects}
          meta={projectsMeta}
          filterProps={filterProps}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  );
}
