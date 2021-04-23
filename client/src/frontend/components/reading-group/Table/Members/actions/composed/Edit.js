import React from "react";
import PropTypes from "prop-types";
import Button from "../Button";

function EditMember({ onClick }) {
  return <Button onClick={onClick}>Edit</Button>;
}

EditMember.displayName = "MembersTable.Member.Edit";

EditMember.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default EditMember;
