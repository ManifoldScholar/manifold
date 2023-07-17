import lh from "helpers/linkHandler";

export const getBreadcrumbs = (resource, project, belongsToJournalIssue, t) => {
  /* eslint-disable no-nested-ternary */
  const currentCrumb =
    resource === "import"
      ? [
          {
            to: lh.link("backendResourceImport"),
            label: t("actions.import")
          }
        ]
      : resource
      ? [
          {
            to: lh.link("backendResource", resource.id),
            label: resource.attributes.title
          }
        ]
      : [
          {
            to: lh.link("backendProjectResourcesNew"),
            label: t("common.new")
          }
        ];

  return belongsToJournalIssue
    ? [
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
        },
        ...currentCrumb
      ]
    : [
        { to: null, label: t("glossary.project_title_case_other") },
        {
          to: lh.link("backendProjects"),
          label: t("pages.projects_all")
        },
        {
          to: lh.link("backendProject", project.id),
          label: project.attributes.titlePlaintext
        },
        {
          to: lh.link("backendProjectResources", project.id),
          label: t("glossary.resource_title_case_other")
        },
        ...currentCrumb
      ];
};
