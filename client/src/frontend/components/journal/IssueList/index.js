import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import EntityGroup from "global/components/composed/EntityGroup";
import { capitalize } from "utils/string";
import * as Styled from "./styles";

function JournalIssueList({ issues = [] }) {
  const { t } = useTranslation();

  if (!issues) return null;

  return (
    <Styled.Wrapper>
      <EntityGroup
        title={capitalize(t("glossary.issue_other"))}
        entities={issues}
        parentView
      />
    </Styled.Wrapper>
  );
}

JournalIssueList.displayName = "Journal.IssueList";

JournalIssueList.propTypes = {
  issues: PropTypes.array
};

export default JournalIssueList;
