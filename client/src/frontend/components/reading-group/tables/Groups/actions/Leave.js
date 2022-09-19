import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";
import { useDispatch } from "react-redux";
import { readingGroupMembershipsAPI, requests } from "api";
import { entityStoreActions } from "actions";

function LeaveGroup({ membership, readingGroup, onLeave }) {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { request } = entityStoreActions;

  const destroyMembership = useCallback(
    rgMembership => {
      const call = readingGroupMembershipsAPI.destroy(rgMembership.id);
      const options = { removes: rgMembership };
      const readingGroupMembershipRequest = request(
        call,
        requests.feReadingGroupMembershipDestroy,
        options
      );
      dispatch(readingGroupMembershipRequest).promise.then(onLeave);
    },
    [dispatch, request, onLeave]
  );

  const isCreator =
    membership.relationships.user.id === readingGroup.attributes.creatorId;

  return !isCreator ? (
    <Action onClick={() => destroyMembership(membership)}>
      {t("actions.leave")}
    </Action>
  ) : null;
}

LeaveGroup.displayName = "GroupsTable.Group.Edit";

LeaveGroup.propTypes = {
  membership: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired,
  onLeave: PropTypes.func.isRequired
};

export default LeaveGroup;
