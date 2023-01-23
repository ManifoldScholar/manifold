import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import GlobalUtility from "global/components/utility";
import { projectCollectionsAPI } from "api";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation
} from "hooks";

export default function ProjectCollectionsContainer() {
  const baseFilters = { visible: true, order: "position ASC" };
  const [filters] = useFilterState(baseFilters);
  const projectsPagination = useMemo(
    () => ({
      size: 4,
      number: 1
    }),
    []
  );
  const [pagination, setPageNumber] = usePaginationState(
    1,
    8,
    projectsPagination
  );
  const { data: projectCollections, meta } = useFetch({
    request: [projectCollectionsAPI.index, filters, pagination]
  });
  const { t } = useTranslation();

  const showPagination = () => {
    const totalPages = meta?.pagination ?? {};
    if (!totalPages || totalPages === 1) return false;
    return true;
  };

  useSetLocation({ page: pagination.number });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
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
            <GlobalUtility.Pagination
              paginationClickHandler={paginationClickHandlerCreator}
              pagination={meta.pagination}
            />
          </div>
        </section>
      )}
      <CollectionNavigation />
    </>
  ) : null;
}

ProjectCollectionsContainer.displayName =
  "Frontend.Containers.ProjectCollections";
