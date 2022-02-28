import React from "react";
import IssueCount from "../IssueCount";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";

function JournalIssueCount({ journal }) {
  const { t } = useTranslation();
  const issueCount = journal.attributes?.journalIssuesCount || 0;

  return (
    <Utility.EntityCount
      count={issueCount}
      unit={t("glossary.issue", { count: issueCount })}
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
