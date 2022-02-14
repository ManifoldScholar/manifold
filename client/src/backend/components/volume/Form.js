import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { journalVolumesAPI } from "api";

function VolumeForm({ journalId, model, ...props }) {
  return (
    <FormContainer.Form
      {...props}
      name={model ? "update-journal-volume" : "create-journal-volume"}
      update={journalVolumesAPI.update}
      create={toCreate => journalVolumesAPI.create(journalId, toCreate)}
      className="form-secondary"
      model={model}
    >
      <Form.NumberInput label="Number" focusOnMount name="attributes[number]" />
      <Form.TextInput
        wide
        label="Slug"
        name="attributes[pendingSlug]"
        placeholder="Enter Journal Volume Slug"
      />
      <Form.Save
        text={model ? "Update  Journal Volume" : "Create Journal Volume"}
      />
    </FormContainer.Form>
  );
}

VolumeForm.prop_types = {
  model: PropTypes.object,
  journalId: PropTypes.string.isRequired
};

export default VolumeForm;
