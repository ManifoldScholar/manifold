import { useMemo } from "react";
import { redirect } from "react-router";
import { ApiClient, projectCollectionsAPI, projectsAPI } from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import loadList from "app/routes/utility/loaders/loadList";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollection from "frontend/components/entity/Collection";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { useListFilters, useListSearchParams, useSubjects } from "hooks";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

const PROJECTS_FILTER_RESET = { collectionOrder: null };

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  if (params.id === "all") {
    throw redirect("/project-collections");
  }

  const { auth } = context.get(routerContext);
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const projectCollection = await client.call(
    projectCollectionsAPI.show(params.id)
  );

  if (!projectCollection) {
    throw redirect("/project-collections");
  }

  const projectsData = await loadList({
    request,
    context,
    fetchFn: projectsAPI.index,
    options: {
      defaultFilters: { ...PROJECTS_FILTER_RESET, collectionOrder: params.id }
    }
  });

  return {
    projectCollection,
    ...projectsData
  };
};

export const clientLoader = async ({ request, serverLoader, params }) => {
  const fetchFn = (filters, pagination) =>
    projectsAPI.index(filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__projectCollectionProjectsHydrated",
    fetchFn,
    options: {
      defaultFilters: { ...PROJECTS_FILTER_RESET, collectionOrder: params.id }
    }
  });

  const listData = await clientLoaderFn({ request, serverLoader });

  // Get the projectCollection from serverLoader (it doesn't change with filters)
  const serverData = await serverLoader();

  return {
    ...serverData,
    ...listData
  };
};

export default function ProjectCollectionDetailRoute({ loaderData }) {
  const { id } = useParams();
  const { projectCollection, data: projects, meta } = loaderData || {};

  const allSubjects = useSubjects();
  const collectionSubjects = projectCollection?.relationships?.projectSubjects
    ?.length
    ? allSubjects.filter(s =>
        projectCollection.relationships.projectSubjects.find(
          ps => ps.id === s.id
        )
      )
    : [];

  const filtersReset = useMemo(
    () => ({
      collectionOrder: id
    }),
    [id]
  );

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: filtersReset
  });

  const { t } = useTranslation();

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: filtersReset,
    options: {
      subjects: collectionSubjects,
      featured: true,
      featuredLabel: t("filters.featured_projects")
    }
  });

  const breadcrumbs = [
    {
      to: "/project-collections",
      label: t("navigation.breadcrumbs.all_project_collections")
    }
  ];

  const headContentProps = useEntityHeadContent(projectCollection);

  if (!projectCollection) return null;

  return (
    <>
      <CheckFrontendMode
        debugLabel="ProjectCollectionDetail"
        isProjectSubpage
      />
      {projectCollection && (
        <EventTracker
          event={EVENTS.VIEW_RESOURCE}
          resource={projectCollection}
        />
      )}
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <HeadContent {...headContentProps} />
      <h1 className="screen-reader-text">
        {projectCollection.attributes.title}
      </h1>
      <EntityCollection.ProjectCollectionDetail
        projectCollection={projectCollection}
        projects={projects}
        projectsMeta={meta}
        filterProps={filterProps}
        bgColor="neutral05"
        className="flex-grow"
      />
      <CollectionNavigation />
    </>
  );
}
