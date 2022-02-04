import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Volume from "backend/components/volume";
import Navigation from "backend/components/navigation";
import { journalVolumesAPI } from "api";
import { useFetch, useApiCallback } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";

function JournalVolumeEdit({
  refreshVolumes,
  closeUrl,
  match,
  journal,
  history,
  confirm
}) {
  const { data: journalVolume } = useFetch({
    request: [journalVolumesAPI.show, match.params.vId]
  });

  const destroy = useApiCallback(journalVolumesAPI.destroy, {
    removes: journalVolume
  });

  const destroyAndRedirect = useCallback(() => {
    const redirect = () =>
      history.push(lh.link("backendJournalVolumes", journal.id));
    destroy(journalVolume.id).then(
      () => redirect(),
      () => redirect()
    );
  }, [destroy, history, journal.id, journalVolume.id]);

  const onDelete = useCallback(() => {
    const heading = "Are you sure you want to delete this volume?";
    const message = "This action cannot be undone.";
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm]);

  const refreshAndRedirect = useCallback(() => {
    refreshVolumes();
    history.push(closeUrl, { keepNotifications: false });
  }, [history, closeUrl, refreshVolumes]);

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
      <Navigation.DrawerHeader title="Edit Volume" buttons={buttons} />
      <Volume.Form
        model={journalVolume}
        journalId={journal.id}
        onSuccess={refreshAndRedirect}
      />
    </div>
  );
}

JournalVolumeEdit.propTypes = {
  journal: PropTypes.object.isRequired,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  refreshVolumes: PropTypes.func.isRequired
};

export default withConfirmation(JournalVolumeEdit);
