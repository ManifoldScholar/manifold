import React from "react";
import { useLocation } from "react-router-dom";
import CollectionNavigation from "frontend/components/composed/CollectionNavigation";
import { projectsAPI } from "api";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import EntityCollection from "frontend/components/composed/EntityCollection";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useFromStore,
  useSetLocation,
  useListFilters
} from "hooks";

export default function ProjectsContainer() {
  const subjects = useFromStore("feSubjects", "select");

  const [pagination, setPageNumber] = usePaginationState();
  // Requires a string value for comparison to filter values in useListFilters
  const baseFilters = { standaloneModeEnforced: "false" };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: projects, meta } = useFetch({
    request: [projectsAPI.index, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });
  const location = useLocation();

  const showPlaceholder = location.search
    ? false
    : !projects || !projects.length;

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: baseFilters,
    options: {
      sort: true,
      subjects,
      featured: true,
      featuredLabel: "FeaturedProjects"
    }
  });

  return meta ? (
    <>
      <h1 className="screen-reader-text">All Projects</h1>
      {showPlaceholder ? (
        <EntityCollectionPlaceholder.Projects />
      ) : (
        <EntityCollection.Projects
          projects={projects}
          meta={meta}
          filterProps={filterProps}
          paginationProps={{
            paginationClickHandler: page => () => setPageNumber(page),
            paginationTarget: "#"
          }}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  ) : null;
}

ProjectsContainer.displayName = "Frontend.Projects";
