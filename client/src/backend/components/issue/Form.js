import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { journalIssuesAPI, journalVolumesAPI, projectsAPI } from "api";
import EntitiesList, { ProjectRow } from "backend/components/list/EntitiesList";

function IssueForm({ journalId, model, ...props }) {
  const fetchWritableProjects = useCallback(() => {
    return projectsAPI.index({ withUpdateAbility: true });
  }, []);

  const fetchJournalVolumes = useCallback(() => {
    return journalVolumesAPI.index(journalId);
  }, [journalId]);

  return (
    <FormContainer.Form
      {...props}
      name={model ? "update-journal-issue" : "create-journal-issue"}
      update={journalIssuesAPI.update}
      create={toCreate => journalIssuesAPI.create(journalId, toCreate)}
      className="form-secondary"
      model={model}
    >
      <Form.NumberInput label="Number" focusOnMount name="attributes[number]" />
      <Form.Picker
        instructions="Optionally, select a volume."
        label="Volume"
        name="relationships[journalVolume]"
        optionToLabel={volume => volume.attributes.number}
        predictive
        listStyle={"rows"}
        options={fetchJournalVolumes}
      />
      <Form.TextInput
        wide
        label="Slug"
        name="attributes[pendingSlug]"
        placeholder="Enter Journal Issue Slug"
      />
      {model?.id ? (
        <div className="form-input">
          <span className="form-input-heading">Associated Project</span>
          <EntitiesList
            entities={[model.relationships.project]}
            entityComponent={ProjectRow}
            unit="project"
          />
        </div>
      ) : (
        <Form.Picker
          disabled
          instructions="Issue content is stored in projects. Select an existing content or leave blank to create a new project."
          label="Project"
          name="relationships[project]"
          optionToLabel={project => project.attributes.title}
          predictive
          listStyle={"rows"}
          options={fetchWritableProjects}
        />
      )}
      <Form.Save
        text={model ? "Update  Journal Issue" : "Create Journal Issue"}
      />
    </FormContainer.Form>
  );
}

IssueForm.prop_types = {
  model: PropTypes.object,
  journalId: PropTypes.string.isRequired
};

export default IssueForm;
