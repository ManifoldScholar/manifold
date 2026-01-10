import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";

export default function useArchiveOrActivateGroup({ membership }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const archive = membership?.links?.archive;
  const activate = membership?.links?.activate;

  const doArchive = useCallback(async () => {
    if (!archive) {
      throw new Error("Archiving is not permitted under this membership.");
    }
    await queryApi({
      endpoint: archive,
      method: "POST",
      options: {}
    });
  }, [archive]);

  const doActivate = useCallback(async () => {
    if (!activate) {
      throw new Error("Activation is not permitted under this membership.");
    }
    await queryApi({
      endpoint: activate,
      method: "POST",
      options: {}
    });
  }, [activate]);

  const onClick = useCallback(async () => {
    if (activate) {
      try {
        await doActivate();
        revalidate();
      } catch (error) {
        console.error("Failed to activate reading group:", error);
      }
      return;
    }

    const heading = t("messages.reading_group.archive_heading");
    const message = t("messages.reading_group.archive_message");
    confirm({
      heading,
      message,
      callback: async closeDialog => {
        try {
          await doArchive();
          revalidate();
          closeDialog();
        } catch (error) {
          console.error("Failed to archive reading group:", error);
          closeDialog();
        }
      }
    });
  }, [activate, doActivate, doArchive, confirm, t, revalidate]);

  return {
    onClick,
    label: archive ? t("actions.archive") : t("actions.activate"),
    confirmation: confirmation && <Dialog.Confirm {...confirmation} />
  };
}
