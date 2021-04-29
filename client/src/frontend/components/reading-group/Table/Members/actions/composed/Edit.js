import React from "react";
import PropTypes from "prop-types";
import Buttonish from "../Buttonish";
import lh from "helpers/linkHandler";

function EditMember({ membership, readingGroup }) {
  return (
    <Buttonish
      to={lh.link("frontendReadingGroupMember", readingGroup.id, membership.id)}
    >
      Edit
    </Buttonish>
  );
}

EditMember.displayName = "MembersTable.Member.Edit";

EditMember.propTypes = {
  membership: PropTypes.object.isRequired,
  readingGroup: PropTypes.object.isRequired
};

export default EditMember;
