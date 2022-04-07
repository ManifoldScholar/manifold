import lh from "helpers/linkHandler";

export const getJournalBreadcrumbs = (project, t, libraryDisabled) => {
  const issue = project.relationships?.journalIssue;
  const parentJournal = project.relationships?.journal;
  const parentVolume = issue.relationships?.journalVolume;

  return [
    !libraryDisabled && {
      to: lh.link("frontendJournals"),
      label: t("navigation.breadcrumbs.all_journals")
    },
    parentJournal && {
      to: lh.link("frontendJournalDetail", parentJournal.attributes.slug),
      label: parentJournal.attributes.titlePlaintext
    },
    parentVolume && {
      to: lh.link(
        "frontendVolumeDetail",
        parentJournal.attributes.slug,
        parentVolume.attributes.slug
      ),
      label: `${t("glossary.volume_one")} ${parentVolume.attributes.number}`
    },
    {
      to: lh.link("frontendProjectDetail", project.attributes.slug),
      label: `${t("glossary.issue_truncated_one")} ${issue.attributes.number}`
    }
  ].filter(Boolean);
};
