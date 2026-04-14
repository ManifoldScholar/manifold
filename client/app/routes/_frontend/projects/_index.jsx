import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import EntityCollectionPlaceholder from "components/global/entity/CollectionPlaceholder";
import EntityCollection from "components/frontend/entity/Collection";
import HeadContent from "components/global/HeadContent";
import { useContext } from "react";
import { FrontendContext } from "app/contexts";
import { useListFilters, useListSearchParams } from "hooks";

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

export default function ProjectsRoute({ loaderData }) {
  const { data: projects, meta } = loaderData;
  const { subjects } = useContext(FrontendContext);
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
