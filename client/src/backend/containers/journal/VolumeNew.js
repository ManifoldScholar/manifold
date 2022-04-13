import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Volume from "backend/components/volume";
import Navigation from "backend/components/navigation";

function JournalVolumeNew({ refreshVolumes, closeUrl, journal, history }) {
  const { t } = useTranslation();

  const refreshAndRedirect = () => {
    refreshVolumes();
    history.push(closeUrl, { keepNotifications: false });
  };

  return (
    <div>
      <Navigation.DrawerHeader
        title={t("backend_entities.volumes.create_header")}
      />
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
