import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Issue from "backend/components/issue";
import Layout from "backend/components/layout";

function JournalIssueNew({ refreshIssues, closeUrl, journal, history }) {
  const { t } = useTranslation();
  const refreshAndRedirect = () => {
    refreshIssues();
    history.push(closeUrl, { keepNotifications: false });
  };

  return (
    <div>
      <Layout.DrawerHeader title={t("issues.create_header")} />
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
