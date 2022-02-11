import React from "react";
import EntityResourcesContainer from "./EntityResourcesContainer";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";

const getBreadcrumbs = entity => {
  if (entity.type === "projects") {
    const { slug, titlePlaintext } = entity.attributes;
    return [
      {
        to: lh.link("frontendProjectDetail", slug),
        label: titlePlaintext
      }
    ];
  }
  if (entity.type === "journalIssues") {
    const { number } = entity.attributes;
    const parentJournal = entity.relationships.journal;
    const parentVolume = entity.relationships.journalVolume;

    return [
      {
        to: lh.link("frontendJournals"),
        label: "All Journals"
      },
      parentJournal && {
        to: lh.link("frontendJournalDetail", parentJournal.id),
        label: parentJournal.attributes.titlePlaintext
      },
      parentVolume && {
        to: lh.link("frontendVolumeDetail", parentJournal.id, parentVolume.id),
        label: `Volume ${parentVolume.attributes.number}`
      },
      {
        to: lh.link("frontendIssueDetail", entity.id),
        label: `Issue ${number}`
      },
      {
        to: lh.link("frontendIssueResources", entity.id),
        label: `Resources`
      }
    ].filter(Boolean);
  }
};

export default function EntityResourcesWrapper({ issue, project }) {
  const entity = project ?? issue?.relationships?.project;
  if (!entity) return null;

  return entity ? (
    <EntityResourcesContainer
      entity={entity}
      breadcrumbs={getBreadcrumbs(project ?? issue)}
    />
  ) : (
    <LoadingBlock />
  );
}
