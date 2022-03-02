import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { requests } from "api";
import { useDispatch } from "react-redux";
import config from "config";
import Action from "global/components/table/Action";
import { entityStoreActions } from "actions";
import withConfirmation from "hoc/withConfirmation";

const { request } = entityStoreActions;

function ArchiveGroup({ membership, confirm }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!membership) return null;

  const archive = membership?.links?.archive;
  const activate = membership?.links?.activate;

  function doArchive() {
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
    dispatch(archiveRequest);
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
    dispatch(activateRequest);
  }

  function handleClick() {
    if (activate) return doActivate();

    const { heading, message } = config.app.locale.dialogs.readingGroup.archive;

    confirm(heading, message, () => doArchive());
  }

  return (
    <Action onClick={handleClick}>
      {archive ? t("actions.archive") : t("actions.activate")}
    </Action>
  );
}

ArchiveGroup.displayName = "GroupsTable.Group.Archive";

ArchiveGroup.propTypes = {
  membership: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(ArchiveGroup);
