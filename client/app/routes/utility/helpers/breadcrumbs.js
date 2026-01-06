export const getJournalBreadcrumbs = (project, t, libraryDisabled) => {
  const issue = project.relationships?.journalIssue;
  const parentJournal = project.relationships?.journal;
  const parentVolume = issue?.relationships?.journalVolume;

  return [
    !libraryDisabled && {
      to: "/journals",
      label: t("navigation.breadcrumbs.all_journals")
    },
    parentJournal && {
      to: `/journals/${parentJournal.attributes.slug}`,
      label: parentJournal.attributes.titlePlaintext
    },
    parentVolume && {
      to: `/journals/${parentJournal.attributes.slug}/volumes/${parentVolume.attributes.slug}`,
      label: `${t("glossary.volume_one")} ${parentVolume.attributes.number}`
    },
    {
      to: `/projects/${project.attributes.slug}`,
      label: `${t("glossary.issue_truncated_one")} ${issue.attributes.number}`
    }
  ].filter(Boolean);
};
