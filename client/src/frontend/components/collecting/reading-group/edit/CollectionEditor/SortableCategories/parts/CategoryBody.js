import * as React from "react";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources,
  CollectedJournalIssues
} from "../types";

export default function CategoryBody({
  category,
  mappings,
  responses,
  callbacks
}) {
  const categoryMapping = mappings[category?.id] || null;

  function getCollectedIdsByType(type) {
    if (!categoryMapping || !categoryMapping[type]) return [];
    return categoryMapping[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type];
  }

  function getCollectedProps(type) {
    return {
      categoryId: category?.id || "",
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onRemove: callbacks.onCollectableRemove,
      onMove: callbacks.onCollectableMove(category?.id),
      onSort: callbacks.onCollectableSort(category?.id)
    };
  }

  return (
    <>
      <CollectedProjects {...getCollectedProps("projects")} />
      <CollectedJournalIssues {...getCollectedProps("journalIssues")} />
      <CollectedTexts {...getCollectedProps("texts")} />
      <CollectedTextSections {...getCollectedProps("textSections")} />
      <CollectedResourceCollections
        {...getCollectedProps("resourceCollections")}
      />
      <CollectedResources {...getCollectedProps("resources")} />
    </>
  );
}
