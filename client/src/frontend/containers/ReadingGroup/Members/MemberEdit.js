import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { requests } from "api";
import { entityStoreActions } from "actions";
import Navigation from "backend/components/navigation";
import { MemberSettingsForm } from "frontend/components/reading-group/forms";
import {
  useDispatchReadingGroupMembership,
  useGrabReadingGroupMembership
} from "hooks";

const { flush } = entityStoreActions;

function ReadingGroupMemberEditContainer({
  match,
  readingGroup,
  confirm,
  dispatch,
  onRemoveClick,
  onEditSuccess
}) {
  const membershipId = match.params.membershipId;

  useDispatchReadingGroupMembership(membershipId);
  const {
    readingGroupMembership: membership,
    readingGroupMembershipResponse: membershipResponse
  } = useGrabReadingGroupMembership(membershipId);

  useEffect(() => {
    return () => dispatch(flush([requests.feReadingGroupMembershipShow]));
  }, [dispatch]);

  if (!membershipResponse) return null;

  return (
    <section>
      <Navigation.DrawerHeader
        title="Edit Group Member"
        buttons={[
          {
            onClick: () => onRemoveClick(membership),
            icon: "delete24",
            label: "Delete",
            iconClass: "utility-button__icon utility-button__icon--notice"
          }
        ]}
        buttonLayout="inline"
        className="drawer-header--pad-bottom-small"
      />
      <MemberSettingsForm
        membership={membership}
        readingGroup={readingGroup}
        confirm={confirm}
        onSuccess={onEditSuccess}
      />
    </section>
  );
}

ReadingGroupMemberEditContainer.propTypes = {
  match: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onEditSuccess: PropTypes.func.isRequired
};

export default ReadingGroupMemberEditContainer;
