import React from "react";
import PropTypes from "prop-types";
import Volume from "backend/components/volume";
import Navigation from "backend/components/navigation";

function JournalVolumeNew({ refreshVolumes, closeUrl, journal, history }) {
  const refreshAndRedirect = () => {
    refreshVolumes();
    history.push(closeUrl, { keepNotifications: false });
  };

  return (
    <div>
      <Navigation.DrawerHeader title="Create volume" />
      <Volume.Form journalId={journal.id} onSuccess={refreshAndRedirect} />
    </div>
  );
}

JournalVolumeNew.propTypes = {
  journal: PropTypes.object.isRequired,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  refreshVolumes: PropTypes.func.isRequired
};

export default JournalVolumeNew;
