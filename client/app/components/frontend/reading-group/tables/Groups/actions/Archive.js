import React from "react";
import PropTypes from "prop-types";
import Action from "components/global/table/Action";
import { useArchiveOrActivateGroup } from "components/frontend/reading-group/hooks";

function ArchiveGroup({ membership }) {
  const { onClick, label, confirmation } = useArchiveOrActivateGroup({
    membership
  });

  if (!membership) return null;

  return (
    <>
      {confirmation}
      <Action onClick={onClick}>{label}</Action>
    </>
  );
}

ArchiveGroup.displayName = "GroupsTable.Group.Archive";

ArchiveGroup.propTypes = {
  membership: PropTypes.object.isRequired
};

export default ArchiveGroup;
