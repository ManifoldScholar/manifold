import React from "react";
import PropTypes from "prop-types";
import EntityGroup from "global/components/composed/EntityGroup";
import * as Styled from "./styles";

function JournalIssueList({ issues = [] }) {
  if (!issues) return null;

  return (
    <Styled.Wrapper>
      <EntityGroup title="Issues" entities={issues} parentView />
    </Styled.Wrapper>
  );
}

JournalIssueList.displayName = "Journal.IssueList";

JournalIssueList.propTypes = {
  issues: PropTypes.array
};

export default JournalIssueList;
