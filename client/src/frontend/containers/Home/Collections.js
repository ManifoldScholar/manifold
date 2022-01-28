import React, { useMemo } from "react";
import { useFetch } from "hooks";
import { projectCollectionsAPI } from "api";
import EntityCollection from "frontend/components/composed/EntityCollection";

export default function HomeCollectionsContainer() {
  const filters = useMemo(
    () => ({
      visibleOnHomepage: true,
      order: "position ASC"
    }),
    []
  );

  const { data } = useFetch({
    request: [projectCollectionsAPI.index, filters]
  });

  if (!data) return null;
  return data.map((projectCollection, index) => (
    <EntityCollection.ProjectCollectionSummary
      key={projectCollection.id}
      projectCollection={projectCollection}
      limit={projectCollection.attributes.homepageCount}
      bgColor={index % 2 === 0 ? "neutral05" : "white"}
    />
  ));
}
