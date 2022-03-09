import lh from "helpers/linkHandler";

export const getJournalBreadcrumbs = (project, t) => {
  const issue = project.relationships?.journalIssue;
  const parentJournal = project.relationships?.journal;
  const parentVolume = issue.relationships?.journalVolume;

  return [
    {
      to: lh.link("frontendJournals"),
      label: t("navigation.breadcrumbs.all_journals")
    },
    parentJournal && {
      to: lh.link("frontendJournalDetail", parentJournal.id),
      label: parentJournal.attributes.titlePlaintext
    },
    parentVolume && {
      to: lh.link("frontendVolumeDetail", parentJournal.id, parentVolume.id),
      label: `${t("glossary.volume_one")} ${parentVolume.attributes.number}`
    },
    {
      to: lh.link("frontendProjectDetail", project.attributes.slug),
      label: `${t("glossary.issue_truncated_one")} ${issue.attributes.number}`
    }
  ].filter(Boolean);
};
