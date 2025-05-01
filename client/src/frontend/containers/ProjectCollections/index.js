import React from "react";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import GlobalUtility from "global/components/utility";
import { projectCollectionsAPI } from "api";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";
import { useFetch, useListQueryParams } from "hooks";

export default function ProjectCollectionsContainer() {
  const { pagination, filters } = useListQueryParams({
    initSize: 8,
    initFilters: { visible: true, order: "position ASC" },
    collectionPagination: {
      size: 4,
      number: 1,
    },
  });

  const { data: projectCollections, meta } = useFetch({
    request: [projectCollectionsAPI.index, filters, pagination],
  });
  const { t } = useTranslation();

  const showPagination = () => {
    const { totalPages } = meta?.pagination ?? {};
    if (!totalPages || totalPages === 1) return false;
    return true;
  };

  const renderProjectCollections = () => {
    if (!projectCollections.length)
      return <EntityCollectionPlaceholder.ProjectCollectionsFrontend />;

    return projectCollections.map((projectCollection, index) => (
      <EntityCollection.ProjectCollectionSummary
        key={projectCollection.id}
        projectCollection={projectCollection}
        limit={4}
        bgColor={index % 2 === 1 ? "neutral05" : "white"}
      />
    ));
  };

  return projectCollections ? (
    <>
      <HeadContent title={t("titles.project_collections")} appendDefaultTitle />
      <CheckFrontendMode debugLabel="ProjectCollections" isProjectSubpage />
      <h1 className="screen-reader-text">
        {t("glossary.project_collection_other")}
      </h1>
      {renderProjectCollections()}
      {showPagination && (
        <section>
          <div className="container">
            <GlobalUtility.Pagination pagination={meta.pagination} />
          </div>
        </section>
      )}
      <CollectionNavigation />
    </>
  ) : null;
}

ProjectCollectionsContainer.displayName =
  "Frontend.Containers.ProjectCollections";
