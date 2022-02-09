import React, { useMemo } from "react";
import { useFetch } from "hooks";
import { projectCollectionsAPI, journalsAPI } from "api";
import EntityCollection from "frontend/components/composed/EntityCollection";

export default function HomeCollectionsContainer() {
  const filters = useMemo(
    () => ({
      visibleOnHomepage: true,
      order: "position ASC"
    }),
    []
  );

  const journalFilters = useMemo(
    () => ({
      showOnHomepage: true
    }),
    []
  );

  const { data: collections } = useFetch({
    request: [projectCollectionsAPI.index, filters],
    refetchOnAuthChange: true
  });

  const { data: journals } = useFetch({
    request: [journalsAPI.index, journalFilters],
    refetchOnAuthChange: true
  });

  const journalCount = journals?.length;

  if (!collections && !journals) return null;

  return (
    <>
      {journals &&
        journals.map((journal, i) => (
          <EntityCollection.JournalIssues
            key={journal.id}
            journal={journal}
            bgColor={i % 2 === 0 ? "neutral05" : "white"}
            limit={8}
          />
        ))}
      {collections &&
        collections.map((projectCollection, i) => (
          <EntityCollection.ProjectCollectionSummary
            key={projectCollection.id}
            projectCollection={projectCollection}
            limit={projectCollection.attributes.homepageCount}
            bgColor={(journalCount + i) % 2 === 0 ? "neutral05" : "white"}
          />
        ))}
    </>
  );
}
