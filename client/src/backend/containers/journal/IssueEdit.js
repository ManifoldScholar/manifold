import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Issue from "backend/components/issue";
import Navigation from "backend/components/navigation";
import { journalIssuesAPI } from "api";
import { useFetch } from "hooks";

function JournalIssueEdit({
  refreshIssues,
  closeUrl,
  match,
  journal,
  history
}) {
  const { data: journalIssue } = useFetch({
    request: [journalIssuesAPI.show, match.params.iId]
  });

  const refreshAndRedirect = useCallback(() => {
    refreshIssues();
    history.push(closeUrl, { keepNotifications: false });
  }, [history, closeUrl, refreshIssues]);

  return (
    <div>
      <Navigation.DrawerHeader title="Edit Issue" />
      <Issue.Form
        model={journalIssue}
        journalId={journal.id}
        onSuccess={refreshAndRedirect}
      />
    </div>
  );
}

JournalIssueEdit.propTypes = {
  journal: PropTypes.object.isRequired,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  refreshIssues: PropTypes.func.isRequired
};

export default JournalIssueEdit;
