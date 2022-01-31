import React from "react";
import PropTypes from "prop-types";
import Issue from "backend/components/issue";
import Navigation from "backend/components/navigation";

function JournalIssueNew({ refreshIssues, closeUrl, journal, history }) {
  const refreshAndRedirect = () => {
    refreshIssues();
    history.push(closeUrl, { keepNotifications: false });
  };

  return (
    <div>
      <Navigation.DrawerHeader title="Create Issue" />
      <Issue.Form journalId={journal.id} onSuccess={refreshAndRedirect} />
    </div>
  );
}

JournalIssueNew.propTypes = {
  journal: PropTypes.object.isRequired,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  refreshIssues: PropTypes.func.isRequired
};

export default JournalIssueNew;
