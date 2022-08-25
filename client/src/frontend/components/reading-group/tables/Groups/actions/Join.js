import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import template from "lodash/template";
import classNames from "classnames";
import { requests } from "api";
import { entityStoreActions } from "actions";
import withConfirmation from "hoc/withConfirmation";

const { request } = entityStoreActions;

function JoinGroup({ confirm, readingGroup, onSuccess, buttonText, outlined }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    const heading = t("messages.reading_group.join.heading");
    const message = t("messages.reading_group.join.message");
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
      {buttonText || t("actions.join")}
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
