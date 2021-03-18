import React, { useState } from "react";
import PropTypes from "prop-types";
import Switch from "global/components/form/Switch";
import ActionBox from "frontend/components/reading-group/ActionBox";

function HeadingManageGroup({ readingGroup }) {
  const [showEditMode, setShowEditMode] = useState(false);

  function handleModeChange(value) {
    console.log(value);
    setShowEditMode(prevState => !prevState);
  }

  return (
    <ActionBox
      title="Manage group:"
      instructions="Edit the Home Page or the settings for your Reading Group."
      actions={
        <div className="group-page-heading__flex-container group-page-heading__flex-container--justify-start">
          <Switch
            label="Edit Home Page:"
            set={handleModeChange}
            value={showEditMode}
            className="group-homepage-mode-toggle"
          />
          <a href="#settings" className="group-settings-link">
            Edit settings
          </a>
        </div>
      }
    />
  );
}

HeadingManageGroup.displayName = "ReadingGroup.Heading.ManageGroup";

HeadingManageGroup.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default HeadingManageGroup;
