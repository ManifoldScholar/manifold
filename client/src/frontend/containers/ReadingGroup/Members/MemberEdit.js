import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { readingGroupMembershipsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Navigation from "backend/components/navigation";
import { MemberSettingsForm } from "frontend/components/reading-group/forms";
import { useFetch } from "hooks";

const { flush } = entityStoreActions;

function ReadingGroupMemberEditContainer({
  readingGroup,
  confirm,
  dispatch,
  onRemoveClick,
  onEditSuccess
}) {
  const { membershipId } = useParams();

  const { data: membership } = useFetch({
    request: [readingGroupMembershipsAPI.show, membershipId]
  });

  useEffect(() => {
    return () => dispatch(flush([requests.feReadingGroupMembershipShow]));
  }, [dispatch]);

  return membership ? (
    <section>
      <Navigation.DrawerHeader
        title="Edit Group Member"
        buttons={[
          {
            onClick: () => onRemoveClick(membership),
            icon: "delete24",
            label: "Delete",
            className: "utility-button__icon utility-button__icon--notice"
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
  ) : null;
}

ReadingGroupMemberEditContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  onEditSuccess: PropTypes.func.isRequired
};

export default ReadingGroupMemberEditContainer;
