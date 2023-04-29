/* eslint-disable no-nested-ternary */
import lh from "helpers/linkHandler";

export const getBreadcrumbs = (project, locationState, isJournalIssue, t) =>
  locationState
    ? [
        { to: null, label: t("common.admin") },
        {
          to: lh.link("backendProjects"),
          label: t("glossary.project_title_case_other")
        },
        {
          to: lh.link("backendProjectCollections"),
          label: t("glossary.project_collection_title_case_other")
        },
        {
          to: lh.link("backendProjectCollection", locationState.id),
          label: locationState.label
        }
      ]
    : isJournalIssue
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
        }
      ]
    : [
        { to: null, label: t("common.admin") },
        {
          to: lh.link("backendProjects"),
          label: t("glossary.project_title_case_other")
        }
      ];
