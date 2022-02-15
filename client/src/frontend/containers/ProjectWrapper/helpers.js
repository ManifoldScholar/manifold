import lh from "helpers/linkHandler";

export const getJournalBreadcrumbs = project => {
  const issue = project.relationships?.journalIssue;
  const parentJournal = project.relationships?.journal;
  const parentVolume = issue.relationships?.journalVolume;

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
      to: lh.link("frontendProjectDetail", project.attributes.slug),
      label: `Issue ${issue.attributes.number}`
    }
  ].filter(Boolean);
};
