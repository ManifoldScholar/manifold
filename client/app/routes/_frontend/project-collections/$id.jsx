import { useContext, useMemo } from "react";
import { redirect, useParams } from "react-router";
import { projectCollectionsAPI, projectsAPI } from "api";
import checkLibraryMode from "lib/react-router/loaders/checkLibraryMode";
import loadList from "lib/react-router/loaders/loadList";
import loadEntity from "lib/react-router/loaders/loadEntity";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import EntityCollection from "components/frontend/entity/Collection";
import { useTranslation } from "react-i18next";
import HeadContent from "components/global/HeadContent";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "components/global/EventTracker";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { FrontendContext } from "app/contexts";
import { useListFilters, useListSearchParams } from "hooks";

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  if (params.id === "all") {
    throw redirect("/project-collections");
  }

  const fetchFn = () => projectCollectionsAPI.show(params.id);
  const projectCollection = await loadEntity({ context, fetchFn, request });

  const projectsData = await loadList({
    request,
    context,
    fetchFn: projectsAPI.index,
    options: {
      defaultFilters: { collectionOrder: params.id }
    }
  });

  return {
    projectCollection,
    ...projectsData
  };
};

export const clientLoader = async ({ request, serverLoader, params }) => {
  const clientFetch = createListClientLoader({
    hydrateKey: "__projectCollectionProjectsHydrated",
    fetchFn: projectsAPI.index,
    options: {
      defaultFilters: { collectionOrder: params.id }
    }
  });

  const projectsData = await clientFetch({ request, serverLoader });

  // Get the projectCollection from serverLoader (it doesn't change with filters)
  const { projectCollection } = await serverLoader();

  return {
    projectCollection,
    ...projectsData
  };
};

export default function ProjectCollectionDetailRoute({ loaderData }) {
  const { id } = useParams();
  const { projectCollection, data: projects, meta } = loaderData;

  const { subjects: allSubjects } = useContext(FrontendContext);
  const collectionSubjects = projectCollection.relationships?.projectSubjects
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

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={projectCollection} />
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
