import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollection from "frontend/components/entity/Collection";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { entityStoreActions as store } from "actions";
import { projectCollectionsAPI, projectsAPI } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { useFetch, useListFilters, useListQueryParams } from "hooks";

export default function ProjectCollectionDetailContainer() {
  const { id } = useParams();
  const { data: projectCollection, uid } = useFetch({
    request: [projectCollectionsAPI.show, id]
  });

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
    request: [projectsAPI.index, filters, pagination]
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => dispatch(store.flush(uid));
  }, [dispatch, uid]);

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: filtersReset,
    options: {
      featured: true,
      featuredLabel: t("filters.featured_projects")
    }
  });

  const breadcrumbs = useMemo(
    () => [
      {
        to: lh.link("frontendProjectCollections"),
        label: t("navigation.breadcrumbs.all_project_collections")
      }
    ],
    [t]
  );

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

ProjectCollectionDetailContainer.displayName =
  "Frontend.Containers.ProjectCollectionDetail";
