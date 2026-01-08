import React from "react";
import PropTypes from "prop-types";
import Action from "global/components/table/Action";
import { useArchiveOrActivateGroup } from "frontend/components/reading-group/hooks";

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
