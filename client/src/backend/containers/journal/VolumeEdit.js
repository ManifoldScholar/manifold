import { useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Volume from "backend/components/volume";
import Layout from "backend/components/layout";
import { journalVolumesAPI } from "api";
import { useFetch, useApiCallback, useNotifications } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";

function JournalVolumeEdit({ confirm }) {
  const { t } = useTranslation();
  const { volumeId } = useParams();
  const navigate = useNavigate();
  const { refreshVolumes, closeUrl, journal } = useOutletContext() || {};

  const { data: journalVolume } = useFetch({
    request: [journalVolumesAPI.show, volumeId],
    condition: !!volumeId
  });

  const destroy = useApiCallback(journalVolumesAPI.destroy, {
    removes: journalVolume
  });

  const { addNotification } = useNotifications();

  const destroyAndRedirect = useCallback(() => {
    const redirect = () =>
      navigate(lh.link("backendJournalVolumes", journal?.id));
    destroy(journalVolume.id).then(
      () => {
        addNotification({
          level: 0,
          id: `JOURNAL_VOLUME_DESTROYED_${journalVolume.id}`,
          heading: t("notifications.volume_delete"),
          body: t("notifications.volume_body", {
            number: journalVolume?.attributes?.number
          }),
          expiration: 5000
        });
        redirect();
      },
      () => redirect()
    );
  }, [destroy, navigate, journal?.id, journalVolume, addNotification, t]);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_volume");
    const message = t("modals.confirm_body");
    if (confirm) {
      confirm(heading, message, destroyAndRedirect);
    }
  }, [destroyAndRedirect, confirm, t]);

  const refreshAndRedirect = useCallback(() => {
    if (refreshVolumes) refreshVolumes();
    navigate(closeUrl, { state: { keepNotifications: false } });
  }, [navigate, closeUrl, refreshVolumes]);

  if (!journalVolume || !journal) return null;

  const buttons = [
    {
      onClick: onDelete,
      label: t("actions.delete"),
      icon: "delete32",
      className: "utility-button__icon--notice"
    }
  ];

  return (
    <div>
      <Layout.DrawerHeader title={t("volumes.edit_header")} buttons={buttons} />
      <Volume.Form
        model={journalVolume}
        journalId={journal.id}
        onSuccess={refreshAndRedirect}
      />
    </div>
  );
}

export default withConfirmation(JournalVolumeEdit);
