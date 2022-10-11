import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import { useTranslation } from "react-i18next";
import Panel from "../parts/Panel";
import Checkbox from "../parts/Checkbox";
import Form from "global/components/form";
import * as Styled from "./styles";

function DuplicatePanel({ readingGroup, onProceed, onCancel }) {
  const uidSeed = useUIDSeed();
  const { t } = useTranslation();
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
      label={t("forms.edit_group.duplicate.label")}
      heading={t("forms.edit_group.duplicate.heading", {
        group: readingGroup.attributes.name
      })}
      instructions={t("forms.edit_group.duplicate.instructions")}
      onProceed={handleProceed}
      onCancel={onCancel}
    >
      <Styled.Inputs className="form-secondary">
        <div>
          <Form.Label
            id={uidSeed("name")}
            label={t("forms.edit_group.duplicate.group_name")}
            styleType="tertiary"
          />
          <Styled.Input
            id={uidSeed("name")}
            type="text"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>
        <div>
          <Checkbox
            id={uidSeed("copyAnnotations")}
            label={t("forms.edit_group.duplicate.copy_annotations")}
            checked={copyAnnotations}
            onChange={event => setCopyAnnotations(event.target.checked)}
          />
          <Checkbox
            id={uidSeed("archive")}
            label={t("forms.edit_group.duplicate.archive")}
            checked={archive}
            onChange={event => setArchive(event.target.checked)}
          />
          <Checkbox
            id={uidSeed("openOnProceed")}
            label={t("forms.edit_group.duplicate.open_after")}
            checked={openOnProceed}
            onChange={event => setOpenOnProceed(event.target.checked)}
          />
        </div>
      </Styled.Inputs>
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
