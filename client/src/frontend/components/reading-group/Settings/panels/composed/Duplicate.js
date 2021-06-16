import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import Panel from "../parts/Panel";
import Checkbox from "../parts/Checkbox";

function DuplicatePanel({ readingGroup, onProceed, onCancel }) {
  const uidSeed = useUIDSeed();
  const [name, setName] = useState(readingGroup.attributes.name);
  const [copyAnnotations, setCopyAnnotations] = useState(false);
  const [archive, setArchive] = useState(false);
  const [openOnProceed, setOpenOnProceed] = useState(false);

  function handleProceed(event) {
    event.preventDefault();
    onProceed({ name, copyAnnotations, archive, openOnProceed });
  }

  return (
    <Panel
      label="Duplicate"
      heading={`Create a copy of “${readingGroup.attributes.name}”`}
      instructions="This will create a copy of your reading group. Once copied, you will need to add users to the group."
      onProceed={handleProceed}
      onCancel={onCancel}
    >
      <div className="group-action-panel__inputs form-secondary">
        <div className="form-input">
          <label htmlFor={uidSeed("name")}>Reading Group Name</label>
          <input
            id={uidSeed("name")}
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div className="form-input">
          <Checkbox
            id={uidSeed("copyAnnotations")}
            label="Copy my anotations"
            checked={copyAnnotations}
            onChange={event => setCopyAnnotations(event.target.checked)}
          />
          <Checkbox
            id={uidSeed("archive")}
            label="Archive copied group"
            checked={archive}
            onChange={event => setArchive(event.target.checked)}
          />
          <Checkbox
            id={uidSeed("openOnProceed")}
            label="Open new group after duplication"
            checked={openOnProceed}
            onChange={event => setOpenOnProceed(event.target.checked)}
          />
        </div>
      </div>
    </Panel>
  );
}

DuplicatePanel.displayName = "ReadingGroup.Settings.DuplicatePanel";

DuplicatePanel.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  onProceed: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default DuplicatePanel;
