export const getProjectBreadcrumbs = (
  project,
  locationState,
  isJournalIssue,
  t
) => {
  if (locationState?.id && locationState?.label) {
    return [
      { to: null, label: t("glossary.project_title_case_other") },
      {
        to: "/backend/project-collections",
        label: t("glossary.project_collection_title_case_other")
      },
      {
        to: `/backend/projects/project-collections/${locationState.id}`,
        label: locationState.label
      },
      {
        to: `/backend/projects/${project.id}`,
        label: project.attributes.titlePlaintext
      }
    ];
  }

  if (isJournalIssue) {
    const journal = project.relationships.journal;
    return [
      {
        to: "/backend/journals",
        label: t("glossary.journal_title_case_other")
      },
      {
        to: `/backend/journals/${journal.id}`,
        label: journal.attributes.titlePlaintext
      },
      {
        to: `/backend/journals/${journal.id}/issues`,
        label: t("glossary.issue_truncated_title_case_other")
      },
      {
        to: `/backend/projects/${project.id}`,
        label: project.attributes.titlePlaintext
      }
    ];
  }

  return [
    { to: null, label: t("glossary.project_title_case_other") },
    {
      to: "/backend/projects",
      label: t("pages.projects_all")
    },
    {
      to: `/backend/projects/${project.id}`,
      label: project.attributes.titlePlaintext
    }
  ];
};

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
