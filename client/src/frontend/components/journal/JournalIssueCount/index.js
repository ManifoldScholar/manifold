import React from "react";
import IssueCount from "../IssueCount";
import Utility from "global/components/utility";

function JournalIssueCount({ journal }) {
  return (
    <div className="container flush">
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
    </div>
  );
}

export default JournalIssueCount;
