import React from "react";
import PropTypes from "prop-types";
import EntityGroup from "global/components/composed/EntityGroup";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import { fixtures } from "helpers/storybook/exports";
import CountTemplate from "./CountTemplate";
import * as Styled from "./styles";

// TODO: update once API is in place
function getCategories(journal) {
  const issues = fixtures
    .collectionFactory("issue", 4)
    .map(issue => issue.data);
  return [
    {
      id: 1,
      title: "Volume 1",
      slug: "vol-1",
      issues
    },
    {
      id: 2,
      title: "Volume 2",
      slug: "vol-2",
      issues
    }
  ];
}

function JournalIssueList({ journal }) {
  const categories = getCategories(journal) || [];
  const uncategorizedIssues = [];

  if (!categories.length && !uncategorizedIssues.length) return null;

  return (
    <Styled.Wrapper>
      <div className="container flush">
        <Utility.EntityCount
          count={8}
          unit="issue"
          customTemplate={(count, unit) => (
            <CountTemplate
              count={count}
              unit={unit}
              categoryCount={categories.length}
            />
          )}
        />
      </div>
      <Styled.List>
        {categories.map(({ id, title, slug, issues }) => (
          <EntityGroup
            key={id}
            title={title}
            to={lh.link("frontendVolumeDetail", journal.id, slug)}
            entities={issues}
          />
        ))}
        {!!uncategorizedIssues.length && (
          <EntityGroup entities={uncategorizedIssues} />
        )}
      </Styled.List>
    </Styled.Wrapper>
  );
}

JournalIssueList.displayName = "Journal.IssueList";

JournalIssueList.propTypes = {
  journal: PropTypes.object
};

export default JournalIssueList;
