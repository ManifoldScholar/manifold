import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { projectsAPI, requests } from "api";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import {
  useFetch,
  useFromStore,
  useListFilters,
  useListQueryParams
} from "hooks";

export default function ProjectsContainer() {
  const subjects = useFromStore({
    requestKey: requests.feSubjects,
    action: "select"
  });

  const filterReset = useMemo(() => ({ standaloneModeEnforced: "false" }), []);

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: filterReset
  });

  const { data: projects, meta } = useFetch({
    request: [projectsAPI.index, filters, pagination]
  });

  const showPlaceholder =
    "keyword" in filters || "featured" in filters ? false : !projects?.length;

  const { t } = useTranslation();

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: filterReset,
    options: {
      entityType: "project",
      sort: true,
      subjects,
      featured: true,
      featuredLabel: t("filters.featured_projects")
    }
  });

  return meta ? (
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
  ) : null;
}

ProjectsContainer.displayName = "Frontend.Projects";
