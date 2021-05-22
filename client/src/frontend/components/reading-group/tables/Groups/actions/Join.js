import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import template from "lodash/template";
import classNames from "classnames";
import config from "config";
import { requests } from "api";
import { entityStoreActions } from "actions";
import withConfirmation from "hoc/with-confirmation";

const { request } = entityStoreActions;

function JoinGroup({ confirm, readingGroup, onSuccess, buttonText, outlined }) {
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
    dispatch(joinRequest).promise.then(() => {
      if (onSuccess) onSuccess();
    });
  }

  function handleClick() {
    const { heading, message } = config.app.locale.dialogs.readingGroup.join;
    const compiledMessage = template(message)({ readingGroup });
    confirm(heading, compiledMessage, () => doJoin());
  }

  return (
    <button
      onClick={handleClick}
      className={classNames({
        "button-tertiary": true,
        "button-tertiary--outlined": outlined
      })}
    >
      {buttonText || "Join"}
    </button>
  );
}

JoinGroup.displayName = "GroupsTable.Group.Join";

JoinGroup.propTypes = {
  confirm: PropTypes.func.isRequired,
  readingGroup: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  buttonText: PropTypes.string,
  outlined: PropTypes.bool
};

export default withConfirmation(JoinGroup);
