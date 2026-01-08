import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";
import { readingGroupMembershipsAPI, requests } from "api";
import { useApiCallback } from "hooks";
import { useRevalidator } from "react-router";

function LeaveGroup({ membership, readingGroup }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy, {
    requestKey: requests.feReadingGroupMembershipDestroy,
    removes: membership
  });

  const destroyMembership = async rgMembership => {
    await deleteMembership(rgMembership.id);
    revalidate();
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
