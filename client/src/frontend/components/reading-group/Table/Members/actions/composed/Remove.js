import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";

function RemoveMember({ onClick }) {
  return (
    <Button onClick={onClick} className="button-lozenge-primary--warn">
      Remove
    </Button>
  );
}

RemoveMember.displayName = "MembersTable.Member.Remove";

RemoveMember.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default RemoveMember;
