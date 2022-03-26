import React from "react";
import PropTypes from "prop-types";
import Action from "global/components/table/Action";
import withConfirmation from "hoc/withConfirmation";
import { useArchiveOrActivateGroup } from "frontend/components/reading-group/hooks";

function ArchiveGroup({ membership, confirm, onArchive }) {
  const { onClick, label } = useArchiveOrActivateGroup({
    membership,
    confirm,
    callback: onArchive
  });

  if (!membership) return null;

  return <Action onClick={onClick}>{label}</Action>;
}

ArchiveGroup.displayName = "GroupsTable.Group.Archive";

ArchiveGroup.propTypes = {
  membership: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  onArchive: PropTypes.func
};

export default withConfirmation(ArchiveGroup);
