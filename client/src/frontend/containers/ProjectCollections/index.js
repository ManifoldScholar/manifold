import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { projectCollectionsAPI } from "api";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";
import { useFetch, useListQueryParams, useListFilters } from "hooks";

export default function ProjectCollectionsContainer() {
  const filterReset = useMemo(() => ({ standaloneModeEnforced: "false" }), []);

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: { visible: true, order: "position ASC" },
    collectionPagination: {
      size: 4,
      number: 1
    }
  });

  const { data: projectCollections, meta } = useFetch({
    request: [projectCollectionsAPI.index, filters, pagination]
  });

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: filterReset,
    options: {
      entityType: "projectCollection",
      sort: true
    }
  });

  const { t } = useTranslation();

  if (!projectCollections || !meta) return null;

  const showPlaceholder =
    "keyword" in filters ? false : !projectCollections.length;

  return projectCollections ? (
    <>
      <HeadContent title={t("titles.project_collections")} appendDefaultTitle />
      <CheckFrontendMode debugLabel="ProjectCollections" isProjectSubpage />
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
  ) : null;
}

ProjectCollectionsContainer.displayName =
  "Frontend.Containers.ProjectCollections";
