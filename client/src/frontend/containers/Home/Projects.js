import React, { useMemo } from "react";
import { projectsAPI, journalsAPI } from "api";
import EntityCollection from "frontend/components/entity/Collection";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
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

  const journalFilters = useMemo(
    () => ({
      showOnHomepage: true
    }),
    []
  );

  const { data, loaded } = useFetch({
    request: [projectsAPI.index, filters, pagination]
  });

  const { data: journals } = useFetch({
    request: [journalsAPI.index, journalFilters],
    withAuthDependency: true
  });

  if (!data) return null;
  if (loaded && data.length === 0)
    return <EntityCollectionPlaceholder.Projects />;
  return (
    <>
      <EntityCollection.ProjectsSummary projects={data} bgColor="neutral05" />
      {journals &&
        journals.map((journal, i) => (
          <EntityCollection.JournalSummary
            key={journal.id}
            journal={journal}
            bgColor={(1 + i) % 2 === 0 ? "neutral05" : "white"}
            limit={8}
          />
        ))}
    </>
  );
}
