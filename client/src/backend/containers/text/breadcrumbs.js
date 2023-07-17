/* eslint-disable no-nested-ternary */
import lh from "helpers/linkHandler";

export const getBreadcrumbs = (text, belongsToJournalIssue, t) => {
  const journal = belongsToJournalIssue
    ? text.attributes.projectJournalNav
    : {};

  return belongsToJournalIssue
    ? [
        {
          to: lh.link("backendJournals"),
          label: t("glossary.journal_title_case_other")
        },
        {
          to: lh.link("backendJournal", journal.id),
          label: journal.label
        },
        {
          to: lh.link("backendJournalIssues", journal.id),
          label: t("glossary.issue_truncated_title_case_other")
        },
        {
          to: lh.link("backendProject", text.relationships.project.id),
          label: text.relationships.project.attributes.titlePlaintext
        },
        {
          to: lh.link("backendProjectTexts", text.relationships.project.id),
          label: t("glossary.article_title_case_other")
        },
        {
          to: lh.link("backendProjectTexts", text.id),
          label: text.attributes.titlePlaintext
        }
      ]
    : [
        {
          to: null,
          label: t("glossary.project_title_case_other")
        },
        {
          to: lh.link("backendProjects"),
          label: t("pages.projects_all")
        },
        {
          to: lh.link("backendProject", text.relationships.project.id),
          label: text.relationships.project.attributes.titlePlaintext
        },
        {
          to: lh.link("backendProjectTexts", text.relationships.project.id),
          label: t("glossary.text_title_case_other")
        },
        {
          to: lh.link("backendProjectTexts", text.id),
          label: text.attributes.titlePlaintext
        }
      ];
};
