import React from "react";
import IssueCount from "../IssueCount";
import Utility from "global/components/utility";

function JournalIssueCount({ journal }) {
  return (
    <Utility.EntityCount
      count={journal.attributes.journalIssuesCount}
      unit="issue"
      customTemplate={(count, unit) => (
        <IssueCount
          count={count}
          unit={unit}
          categoryCount={journal.attributes.journalVolumesCount}
          uncategorized={journal.attributes.journalIssuesWithoutVolumeCount}
        />
      )}
    />
  );
}

export default JournalIssueCount;
