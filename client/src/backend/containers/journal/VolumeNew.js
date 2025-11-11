import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Volume from "backend/components/volume";
import Layout from "backend/components/layout";

export default function JournalVolumeNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refreshVolumes, closeUrl, journal } = useOutletContext() || {};

  const refreshAndRedirect = () => {
    if (refreshVolumes) refreshVolumes();
    navigate(closeUrl, { state: { keepNotifications: false } });
  };

  if (!journal) return null;

  return (
    <div>
      <Layout.DrawerHeader title={t("volumes.create_header")} />
      <Volume.Form journalId={journal.id} onSuccess={refreshAndRedirect} />
    </div>
  );
}
