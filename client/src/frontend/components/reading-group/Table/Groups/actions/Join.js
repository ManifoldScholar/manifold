import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import template from "lodash/template";
import config from "config";
import { requests } from "api";
import { entityStoreActions } from "actions";
import withConfirmation from "hoc/with-confirmation";

const { request } = entityStoreActions;

function JoinGroup({ confirm, readingGroup }) {
  const dispatch = useDispatch();

  function doJoin() {
    const {
      href: endpoint,
      meta: { method }
    } = readingGroup.links.join;
    const call = {
      endpoint,
      method,
      options: {}
    };
    const joinRequest = request(
      call,
      requests.feReadingGroupMembershipCreate,
      {}
    );
    dispatch(joinRequest);
  }

  function handleClick() {
    const { heading, message } = config.app.locale.dialogs.readingGroup.join;
    const compiledMessage = template(message)({ readingGroup });
    confirm(heading, compiledMessage, () => doJoin());
  }

  return (
    <button
      onClick={handleClick}
      className="button-tertiary button-tertiary--neutral"
    >
      Join
    </button>
  );
}

JoinGroup.displayName = "GroupsTable.Group.Join";

JoinGroup.propTypes = {
  confirm: PropTypes.func.isRequired,
  readingGroup: PropTypes.object.isRequired
};

export default withConfirmation(JoinGroup);
