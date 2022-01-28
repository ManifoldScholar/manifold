import React, { useMemo } from "react";
import ProjectList from "frontend/components/project-list";
import { projectsAPI } from "api";
import EntityCollection from "frontend/components/composed/EntityCollection";
import { useFetch, usePaginationState } from "hooks";

export default function HomeProjectContainer() {
  const [pagination] = usePaginationState();

  const filters = useMemo(
    () => ({
      standaloneModeEnforced: false,
      order: "sort_title, title"
    }),
    []
  );

  const { data, loaded } = useFetch({
    request: [projectsAPI.index, filters, pagination]
  });

  if (!data) return null;
  if (loaded && data.length === 0) return <ProjectList.Placeholder />;
  return (
    <EntityCollection.ProjectsSummary projects={data} bgColor="neutral05" />
  );
}
