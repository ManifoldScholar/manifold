import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Volume from "backend/components/volume";
import Navigation from "backend/components/navigation";
import { journalVolumesAPI } from "api";
import { useFetch } from "hooks";

function JournalVolumeEdit({
  refreshVolumes,
  closeUrl,
  match,
  journal,
  history
}) {
  const { data: journalVolume } = useFetch({
    request: [journalVolumesAPI.show, match.params.vId]
  });

  const refreshAndRedirect = useCallback(() => {
    refreshVolumes();
    history.push(closeUrl, { keepNotifications: false });
  }, [history, closeUrl, refreshVolumes]);

  return (
    <div>
      <Navigation.DrawerHeader title="Edit Volume" />
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

export default JournalVolumeEdit;
