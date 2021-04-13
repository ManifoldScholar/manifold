import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import config from "config";
import { requests } from "api";
import { entityStoreActions } from "actions";
import withConfirmation from "hoc/with-confirmation";
import {
  useDispatchReadingGroupMembership,
  useSelectReadingGroupMembership
} from "hooks";

const { request } = entityStoreActions;

function HeadingArchiveToggle({ readingGroup, confirm }) {
  const dispatch = useDispatch();

  const currentUserMembershipId =
    readingGroup.relationships.currentUserReadingGroupMembership[0].id;

  useDispatchReadingGroupMembership(currentUserMembershipId);
  const {
    readingGroupMembership: currentUserMembership
  } = useSelectReadingGroupMembership();

  const archive = currentUserMembership?.links?.archive;
  const activate = currentUserMembership?.links?.activate;

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

  if (!archive && !activate) return null;

  return (
    <button onClick={handleClick} className="group-page-heading__nav-button">
      {archive ? "Archive" : "Activate"}
      {" Group"}
    </button>
  );
}

HeadingArchiveToggle.displayName = "ReadingGroup.Heading.ArchiveToggle";

HeadingArchiveToggle.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(HeadingArchiveToggle);
