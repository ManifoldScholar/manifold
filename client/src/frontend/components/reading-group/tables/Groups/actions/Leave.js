import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";
import { readingGroupMembershipsAPI, requests } from "api";
import { useApiCallback } from "hooks";

function LeaveGroup({ membership, readingGroup, onLeave }) {
  const { t } = useTranslation();

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy, {
    requestKey: requests.feReadingGroupMembershipDestroy,
    removes: membership
  });

  const destroyMembership = async rgMembership => {
    await deleteMembership(rgMembership.id);
    onLeave();
  };

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
