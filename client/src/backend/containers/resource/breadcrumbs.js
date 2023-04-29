import lh from "helpers/linkHandler";

export const getBreadcrumbs = (project, belongsToJournalIssue, t) =>
  belongsToJournalIssue
    ? [
        { to: null, label: t("common.admin") },
        {
          to: lh.link("backendJournals"),
          label: t("glossary.journal_title_case_other")
        },
        {
          to: lh.link("backendJournal", project.relationships.journal.id),
          label: project.relationships.journal.attributes.titlePlaintext
        },
        {
          to: lh.link("backendJournalIssues", project.relationships.journal.id),
          label: t("glossary.issue_truncated_title_case_other")
        },
        {
          to: lh.link("backendProject", project.id),
          label: project.relationships.journalIssue.attributes.title
        },
        {
          to: lh.link("backendProjectResources", project.id),
          label: t("glossary.resource_title_case_other")
        }
      ]
    : [
        { to: null, label: "Admin" },
        {
          to: lh.link("backendProjects"),
          label: t("glossary.project_title_case_other")
        },
        {
          to: lh.link("backendProject", project.id),
          label: project.attributes.titlePlaintext
        },
        {
          to: lh.link("backendProjectResources", project.id),
          label: t("glossary.resource_title_case_other")
        }
      ];
