import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Volume from "backend/components/volume";
import Layout from "backend/components/layout";
import { journalVolumesAPI } from "api";
import { useFetch, useApiCallback, useNotification } from "hooks";
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

  const { t } = useTranslation();

  const notifyDestroy = useNotification(v => ({
    level: 0,
    id: `JOURNAL_VOLUME_DESTROYED_${v.id}`,
    heading: t("notifications.volume_delete"),
    body: t("notifications.volume_body", {
      number: v?.attributes?.number
    }),
    expiration: 5000
  }));

  const destroyAndRedirect = useCallback(() => {
    const redirect = () =>
      history.push(lh.link("backendJournalVolumes", journal.id));
    destroy(journalVolume.id).then(
      () => {
        notifyDestroy(journalVolume);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, history, journal?.id, journalVolume, notifyDestroy]);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_volume");
    const message = t("modals.confirm_body");
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm, t]);

  const refreshAndRedirect = useCallback(() => {
    refreshVolumes();
    history.push(closeUrl, { keepNotifications: false });
  }, [history, closeUrl, refreshVolumes]);

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

JournalVolumeEdit.propTypes = {
  journal: PropTypes.object.isRequired,
  closeUrl: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  refreshVolumes: PropTypes.func.isRequired
};

export default withConfirmation(JournalVolumeEdit);
