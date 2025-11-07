import React from "react";
import ProjectMetadata from "./patterns/ProjectMetadata";
import ProjectCollectionMetadata from "./patterns/ProjectCollectionMetadata";
import JournalMetadata from "./patterns/JournalMetadata";
import JournalIssueMetadata from "./patterns/JournalIssueMetadata";

export default function Wrapper(props) {
  const entity = props.entity;

  if (!entity) return;

  /* eslint-disable no-nested-ternary */
  return entity.type === "projects" ? (
    <ProjectMetadata {...props} />
  ) : entity.type === "projectCollections" ? (
    <ProjectCollectionMetadata {...props} />
  ) : entity.type === "journals" ? (
    <JournalMetadata {...props} />
  ) : entity.type === "journalIssues" ? (
    <JournalIssueMetadata {...props} />
  ) : null;
}
