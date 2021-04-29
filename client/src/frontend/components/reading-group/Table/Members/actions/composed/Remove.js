import React from "react";
import PropTypes from "prop-types";
import Buttonish from "../Buttonish";

function RemoveMember({ onClick }) {
  return (
    <Buttonish onClick={onClick} className="button-lozenge-primary--warn">
      Remove
    </Buttonish>
  );
}

RemoveMember.displayName = "MembersTable.Member.Remove";

RemoveMember.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default RemoveMember;
