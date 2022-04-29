import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import EntityGroup from "global/components/entity/Group";
import * as Styled from "./styles";

function JournalIssueList({ issues = [] }) {
  const { t } = useTranslation();

  if (!issues) return null;

  return (
    <Styled.Wrapper>
      <EntityGroup
        title={t("glossary.issue_truncated_title_case_other")}
        entities={issues}
        parentView
        placeholderText={t("placeholders.journal_no_issues")}
      />
    </Styled.Wrapper>
  );
}

JournalIssueList.displayName = "Journal.IssueList";

JournalIssueList.propTypes = {
  issues: PropTypes.array
};

export default JournalIssueList;
