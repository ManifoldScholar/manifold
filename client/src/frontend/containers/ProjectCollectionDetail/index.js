import { useMemo } from "react";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollection from "frontend/components/entity/Collection";
import { useTranslation } from "react-i18next";
import { useParams, Navigate } from "react-router-dom";
import { projectCollectionsAPI, projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import {
  useFetch,
  useListFilters,
  useListQueryParams,
  useFromStore
} from "hooks";

export default function ProjectCollectionDetailContainer() {
  const { id } = useParams();
  const { data: projectCollection } = useFetch({
    request: [projectCollectionsAPI.show, id],
    condition: id !== "all"
  });

  const allSubjects = useFromStore({
    requestKey: requests.feSubjects,
    action: "select"
  });
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

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: filtersReset
  });

  const { data: projects, meta } = useFetch({
    request: [projectsAPI.index, filters, pagination],
    condition: id !== "all"
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
      to: lh.link("frontendProjectCollections"),
      label: t("navigation.breadcrumbs.all_project_collections")
    }
  ];

  const headContentProps = useEntityHeadContent(projectCollection);

  if (id === "all")
    return <Navigate to={lh.link("frontendProjectCollectionsAll")} />;

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

ProjectCollectionDetailContainer.displayName =
  "Frontend.Containers.ProjectCollectionDetail";
