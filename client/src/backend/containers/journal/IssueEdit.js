import { useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import Issue from "backend/components/issue";
import Layout from "backend/components/layout";
import { journalIssuesAPI } from "api";
import { useFetch, useApiCallback, useNotification } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";

// Not localized for v7, since we are no longer using. -LD

function JournalIssueEdit({ confirm }) {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const { refreshIssues, closeUrl, journal } = useOutletContext() || {};

  const { data: journalIssue } = useFetch({
    request: [journalIssuesAPI.show, issueId],
    condition: !!issueId
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
    if (refreshIssues) refreshIssues();
    navigate(closeUrl, { state: { keepNotifications: false } });
  }, [navigate, closeUrl, refreshIssues]);

  const destroyAndRedirect = useCallback(() => {
    const redirect = () =>
      navigate(lh.link("backendJournalIssues", journal?.id));
    destroy(journalIssue.id).then(
      () => {
        notifyDestroy(journalIssue);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, navigate, journal?.id, journalIssue, notifyDestroy]);

  const onDelete = useCallback(() => {
    const heading = "Are you sure you want to delete this issue?";
    const message = "This action cannot be undone.";
    if (confirm) {
      confirm(heading, message, destroyAndRedirect);
    }
  }, [destroyAndRedirect, confirm]);

  if (!journalIssue || !journal) return null;

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

export default withConfirmation(JournalIssueEdit);
