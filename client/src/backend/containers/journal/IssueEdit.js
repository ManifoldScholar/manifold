import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Issue from "backend/components/issue";
import Layout from "backend/components/layout";
import { journalIssuesAPI } from "api";
import { useFetch, useApiCallback, useNotification } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";

// Not localized for v7, since we are no longer using. -LD

function JournalIssueEdit({
  refreshIssues,
  confirm,
  closeUrl,
  match,
  journal,
  history
}) {
  const { data: journalIssue } = useFetch({
    request: [journalIssuesAPI.show, match.params.iId]
  });

  const destroy = useApiCallback(journalIssuesAPI.destroy, {
    removes: journalIssue
  });

  const notifyDestroy = useNotification(i => ({
    level: 0,
    id: `JOURNAL_ISSUE_DESTROYED_${i.id}`,
    heading: "The issue has been destroyed.",
    body: `Issue #${i?.attributes?.number} has passed into the endless night.`,
    expiration: 5000
  }));

  const refreshAndRedirect = useCallback(() => {
    refreshIssues();
    history.push(closeUrl, { keepNotifications: false });
  }, [history, closeUrl, refreshIssues]);

  const destroyAndRedirect = useCallback(() => {
    const redirect = () =>
      history.push(lh.link("backendJournalIssues", journal?.id));
    destroy(journalIssue.id).then(
      () => {
        notifyDestroy(journalIssue);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, history, journal?.id, journalIssue, notifyDestroy]);

  const onDelete = useCallback(() => {
    const heading = "Are you sure you want to delete this issue?";
    const message = "This action cannot be undone.";
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm]);

  const buttons = [
    {
      onClick: onDelete,
      label: "delete",
      icon: "delete32",
      className: "utility-button__icon--notice"
    }
  ];

  return (
    <div>
      <Layout.DrawerHeader title="Edit Issue" buttons={buttons} />
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

export default withConfirmation(JournalIssueEdit);
