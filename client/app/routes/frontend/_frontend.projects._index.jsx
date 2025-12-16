import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import checkLibraryMode from "app/routes/utility/checkLibraryMode";
import createListClientLoader from "app/routes/utility/createListClientLoader";
import loadList from "app/routes/utility/loadList";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "app/routes/utility/shouldRevalidate";

const FILTER_RESET = { standaloneModeEnforced: "false" };

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });
  return loadList({
    request,
    context,
    fetchFn: projectsAPI.index,
    options: { defaultFilters: FILTER_RESET }
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__projectsHydrated",
  fetchFn: projectsAPI.index,
  options: { defaultFilters: FILTER_RESET }
});

export default function ProjectsRoute() {
  const { data: projects, meta } = useLoaderData();
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
