import React from "react";
import PropTypes from "prop-types";
import EntityGroup from "global/components/composed/EntityGroup";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import CountTemplate from "./CountTemplate";
import * as Styled from "./styles";

function JournalIssueList({ journal }) {
  if (
    !journal?.relationships.recentJournalVolumes.length &&
    !journal?.relationships.recentJournalIssues.length
  )
    return null;

  const noVolumeIssues = journal.relationships.recentJournalIssues.filter(
    issue => !issue.attributes.journalVolumeNumber
  );

  return (
    <Styled.Wrapper>
      <div className="container flush">
        <Utility.EntityCount
          count={journal.attributes.journalIssuesCount}
          unit="issue"
          customTemplate={(count, unit) => (
            <CountTemplate
              count={count}
              unit={unit}
              categoryCount={journal.attributes.journalVolumesCount}
              uncategorized={noVolumeIssues.length}
            />
          )}
        />
      </div>
      <Styled.List>
        {journal.relationships.recentJournalVolumes.map(volume => (
          <EntityGroup
            key={volume.id}
            title={`Volume ${volume.attributes.number}`}
            to={lh.link("frontendVolumeDetail", journal.id, volume.id)}
            entities={volume.relationships.journalIssues}
            parentView
          />
        ))}
        {!!noVolumeIssues.length && (
          <EntityGroup entities={noVolumeIssues} parentView />
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
