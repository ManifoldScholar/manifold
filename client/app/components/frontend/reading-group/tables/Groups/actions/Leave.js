import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import Action from "components/global/table/Action";

function LeaveGroup({ membership, readingGroup }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.errors) {
      console.error("Failed to leave reading group:", fetcher.data.errors);
    }
  }, [fetcher.data]);

  const destroyMembership = useCallback(
    rgMembership => {
      fetcher.submit(
        JSON.stringify({
          intent: "leave",
          membershipId: rgMembership.id
        }),
        {
          method: "post",
          encType: "application/json",
          action: "/actions/reading-group-membership"
        }
      );
    },
    [fetcher]
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
  readingGroup: PropTypes.object.isRequired
};

export default LeaveGroup;
