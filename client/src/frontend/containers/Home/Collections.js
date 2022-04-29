import React, { useMemo } from "react";
import { useFetch } from "hooks";
import { projectCollectionsAPI, journalsAPI } from "api";
import EntityCollection from "frontend/components/entity/Collection";

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
    withAuthDependency: true
  });

  const { data: journals } = useFetch({
    request: [journalsAPI.index, journalFilters],
    withAuthDependency: true
  });

  const collectionCount = collections?.length;

  if (!collections && !journals) return null;

  return (
    <>
      {collections &&
        collections.map((projectCollection, i) => (
          <EntityCollection.ProjectCollectionSummary
            key={projectCollection.id}
            projectCollection={projectCollection}
            limit={projectCollection.attributes.homepageCount}
            bgColor={i % 2 === 0 ? "neutral05" : "white"}
          />
        ))}
      {journals &&
        journals.map((journal, i) => (
          <EntityCollection.JournalSummary
            key={journal.id}
            journal={journal}
            bgColor={(collectionCount + i) % 2 === 0 ? "neutral05" : "white"}
            limit={8}
          />
        ))}
    </>
  );
}
