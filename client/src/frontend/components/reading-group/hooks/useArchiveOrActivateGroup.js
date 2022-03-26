import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { requests } from "api";
import config from "config";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default function useArchiveGroup({ membership, confirm, callback }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const archive = membership?.links?.archive;
  const activate = membership?.links?.activate;

  function doCallback() {
    if (!callback || typeof callback !== "function") return;
    callback();
  }

  function doArchive() {
    if (!archive)
      throw new Error("Archiving is not permitted under this membership.");

    const call = {
      endpoint: archive,
      method: "POST",
      options: {}
    };
    const archiveRequest = request(
      call,
      requests.feReadingGroupMembershipArchive,
      {}
    );
    dispatch(archiveRequest).promise.then(doCallback);
  }

  function doActivate() {
    const call = {
      endpoint: activate,
      method: "POST",
      options: {}
    };
    const activateRequest = request(
      call,
      requests.feReadingGroupMembershipActivate,
      {}
    );
    dispatch(activateRequest).promise.then(doCallback);
  }

  function onClick() {
    if (activate) return doActivate();

    const { heading, message } = config.app.locale.dialogs.readingGroup.archive;

    confirm(heading, message, () => doArchive());
  }

  return {
    onClick,
    label: archive ? t("actions.archive") : t("actions.activate")
  };
}
