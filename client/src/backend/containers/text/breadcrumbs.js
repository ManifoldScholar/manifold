/* eslint-disable no-nested-ternary */
import lh from "helpers/linkHandler";

export const getBreadcrumbs = (text, belongsToJournalIssue, t) => {
  const { journal, issue } = belongsToJournalIssue
    ? text.relationships.project.attributes.journalNav
    : {};

  return belongsToJournalIssue
    ? [
        { to: null, label: t("common.admin") },
        {
          to: lh.link("backendJournals"),
          label: t("glossary.journal_title_case_other")
        },
        {
          to: lh.link("backendJournal", journal.id),
          label: journal.title
        },
        {
          to: lh.link("backendJournalIssues", journal.id),
          label: t("glossary.issue_truncated_title_case_other")
        },
        {
          to: lh.link("backendProject", text.relationships.project.id),
          label: issue.title
        },
        {
          to: lh.link("backendProjectTexts", text.relationships.project.id),
          label: t("glossary.text_title_case_other")
        }
      ]
    : [
        { to: null, label: t("common.admin") },
        {
          to: lh.link("backendProjects"),
          label: t("glossary.project_title_case_other")
        },
        {
          to: lh.link("backendProject", text.relationships.project.id),
          label: text.relationships.project.attributes.titlePlaintext
        },
        {
          to: lh.link("backendProjectTexts", text.relationships.project.id),
          label: t("glossary.text_title_case_other")
        }
      ];
};
