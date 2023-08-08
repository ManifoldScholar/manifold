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
import EventTracker, { EVENTS } from "global/components/EventTracker";
import has from "lodash/has";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useFromStore,
  useSetLocation,
  useListFilters
} from "hooks";

export default function ProjectCollectionDetailContainer() {
  const { id } = useParams();
  const { data: projectCollection, uid } = useFetch({
    request: [projectCollectionsAPI.show, id]
  });

  const baseFilters = {
    collectionOrder: id
  };
  const [filters, setFilters] = useFilterState(baseFilters);
  const [pagination, setPageNumber] = usePaginationState();
  const { data: projects, meta } = useFetch({
    request: [projectsAPI.index, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const settings = useFromStore("settings", "select");

  useEffect(() => {
    return () => dispatch(store.flush(uid));
  }, [dispatch, uid]);

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: baseFilters,
    options: {
      featured: true,
      featuredLabel: t("filters.featured_projects")
    }
  });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

  const breadcrumbs = useMemo(
    () => [
      {
        to: lh.link("frontendProjectCollections"),
        label: t("navigation.breadcrumbs.all_project_collections")
      }
    ],
    [t]
  );

  if (!projectCollection) return null;

  const ogDescription = () => {
    if (!projectCollection) return null;
    const {
      descriptionPlaintext,
      socialDescription
    } = projectCollection.attributes;
    return socialDescription || descriptionPlaintext;
  };

  const ogTitle = () => {
    if (!projectCollection || !settings) return null;
    const { socialTitle, title } = projectCollection.attributes;
    return socialTitle || `\u201c${title}\u201d`;
  };

  const ogImage = () => {
    if (!projectCollection) return null;
    const { socialImageStyles, heroStyles } = projectCollection.attributes;
    if (has(socialImageStyles, "mediumLandscape"))
      return socialImageStyles.mediumLandscape;
    if (has(heroStyles, "mediumLandscape")) return heroStyles.mediumLandscape;
    return null;
  };

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
      <HeadContent
        title={ogTitle()}
        description={ogDescription()}
        image={ogImage()}
        appendDefaultTitle
      />
      <h1 className="screen-reader-text">
        {projectCollection.attributes.title}
      </h1>
      <EntityCollection.ProjectCollectionDetail
        projectCollection={projectCollection}
        projects={projects}
        projectsMeta={meta}
        filterProps={filterProps}
        paginationProps={{
          paginationClickHandler: paginationClickHandlerCreator
        }}
        bgColor="neutral05"
        className="flex-grow"
      />
      <CollectionNavigation />
    </>
  );
}

ProjectCollectionDetailContainer.displayName =
  "Frontend.Containers.ProjectCollectionDetail";
