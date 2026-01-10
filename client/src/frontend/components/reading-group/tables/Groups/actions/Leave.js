import { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Action from "global/components/table/Action";
import { readingGroupMembershipsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useRevalidator } from "react-router";

function LeaveGroup({ membership, readingGroup }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();

  const destroyMembership = useCallback(
    async rgMembership => {
      try {
        await queryApi(readingGroupMembershipsAPI.destroy(rgMembership.id));
        revalidate();
      } catch (err) {
        console.error(err);
      }
    },
    [revalidate]
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
