/* eslint-disable no-nested-ternary */
import lh from "helpers/linkHandler";

export const getBreadcrumbs = (project, locationState, isJournalIssue, t) =>
  locationState?.id && locationState?.label
    ? [
        { to: null, label: t("glossary.project_title_case_other") },
        {
          to: lh.link("backendProjectCollections"),
          label: t("glossary.project_collection_title_case_other")
        },
        {
          to: lh.link("backendProjectCollection", locationState.id),
          label: locationState.label
        },
        {
          to: lh.link("backendProjects", project.id),
          label: project.attributes.titlePlaintext
        }
      ]
    : isJournalIssue
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
          to: lh.link("backendProjects", project.id),
          label: project.attributes.titlePlaintext
        }
      ]
    : [
        { to: null, label: t("glossary.project_title_case_other") },
        {
          to: lh.link("backendProjects"),
          label: t("pages.projects_all")
        },
        {
          to: lh.link("backendProjects", project.id),
          label: project.attributes.titlePlaintext
        }
      ];
