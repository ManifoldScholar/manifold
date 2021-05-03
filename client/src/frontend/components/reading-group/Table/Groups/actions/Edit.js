import React from "react";
import PropTypes from "prop-types";
import Action from "global/components/table/Action";
import lh from "helpers/linkHandler";

function EditGroup({ readingGroup }) {
  const baseLink = lh.link(
    "frontendReadingGroupHomepageStatic",
    readingGroup.id
  );
  const hash = "settings";
  return <Action to={`${baseLink}#${hash}`}>Edit</Action>;
}

EditGroup.displayName = "GroupsTable.Group.Edit";

EditGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default EditGroup;
