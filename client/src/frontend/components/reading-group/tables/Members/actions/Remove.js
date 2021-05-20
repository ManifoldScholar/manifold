import React from "react";
import PropTypes from "prop-types";
import Action from "global/components/table/Action";

function RemoveMember({ onClick }) {
  return (
    <Action onClick={onClick} className="button-lozenge-primary--warn">
      Remove
    </Action>
  );
}

RemoveMember.displayName = "MembersTable.Member.Remove";

RemoveMember.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default RemoveMember;
