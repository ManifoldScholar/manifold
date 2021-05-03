import React from "react";
import PropTypes from "prop-types";
import Action from "global/components/table/Action";
import lh from "helpers/linkHandler";

function EditMember({ membership, readingGroup }) {
  return (
    <Action
      to={lh.link("frontendReadingGroupMember", readingGroup.id, membership.id)}
    >
      Edit
    </Action>
  );
}

EditMember.displayName = "MembersTable.Member.Edit";

EditMember.propTypes = {
  membership: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired
};

export default EditMember;
