import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { useConfirmation } from "hooks";
import Dialog from "global/components/dialog";

export default function useArchiveOrActivateGroup({ membership }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();

  const archive = membership?.links?.archive;
  const activate = membership?.links?.activate;

  useEffect(() => {
    if (fetcher.data?.errors) {
      console.error(
        "Reading group status operation failed:",
        fetcher.data.errors
      );
    }
  }, [fetcher.data]);

  const doArchive = useCallback(() => {
    if (!archive) return;
    fetcher.submit(JSON.stringify({ intent: "archive", endpoint: archive }), {
      method: "post",
      encType: "application/json",
      action: "/actions/reading-group-status"
    });
  }, [archive, fetcher]);

  const doActivate = useCallback(() => {
    if (!activate) return;
    fetcher.submit(JSON.stringify({ intent: "activate", endpoint: activate }), {
      method: "post",
      encType: "application/json",
      action: "/actions/reading-group-status"
    });
  }, [activate, fetcher]);

  const onClick = useCallback(() => {
    if (activate) {
      doActivate();
      return;
    }

    const heading = t("messages.reading_group.archive_heading");
    const message = t("messages.reading_group.archive_message");
    confirm({
      heading,
      message,
      callback: closeDialog => {
        doArchive();
        closeDialog();
      }
    });
  }, [activate, doActivate, doArchive, confirm, t]);

  return {
    onClick,
    label: archive ? t("actions.archive") : t("actions.activate"),
    confirmation: confirmation && <Dialog.Confirm {...confirmation} />
  };
}
