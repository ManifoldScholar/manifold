import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { journalIssuesAPI, journalVolumesAPI, projectsAPI } from "api";
import EntitiesList, { ProjectRow } from "backend/components/list/EntitiesList";
import { useTranslation } from "react-i18next";

function IssueForm({ journalId, model, ...props }) {
  const fetchWritableProjects = useCallback(() => {
    return projectsAPI.index({ withUpdateAbility: true });
  }, []);

  const fetchJournalVolumes = useCallback(() => {
    return journalVolumesAPI.index(journalId);
  }, [journalId]);

  const { t } = useTranslation();

  return (
    <FormContainer.Form
      {...props}
      name={model ? "update-journal-issue" : "create-journal-issue"}
      update={journalIssuesAPI.update}
      create={toCreate => journalIssuesAPI.create(journalId, toCreate)}
      className="form-secondary"
      model={model}
    >
      <Form.TextInput
        label={t("volumes.number_truncated")}
        focusOnMount
        name="attributes[number]"
      />
      <Form.Picker
        instructions={t("issues.volume_instructions")}
        label={t("glossary.volume_title_case_one")}
        name="relationships[journalVolume]"
        optionToLabel={volume => volume.attributes.number}
        predictive
        listStyle={"rows"}
        options={fetchJournalVolumes}
      />
      {model?.id ? (
        <div>
          <Form.Label label={t("issues.associated_project")} />
          <EntitiesList
            entities={[model.relationships.project]}
            entityComponent={ProjectRow}
            unit={t("glossary.project_one")}
          />
        </div>
      ) : (
        <Form.Picker
          disabled
          instructions={t("issues.project_instructions")}
          label={t("glossary.project_title_case_one")}
          name="relationships[project]"
          optionToLabel={project => project.attributes.title}
          predictive
          listStyle={"rows"}
          options={fetchWritableProjects}
        />
      )}
      <Form.Save
        text={model ? t("issues.update_issue") : t("issues.create_issue")}
      />
    </FormContainer.Form>
  );
}

IssueForm.prop_types = {
  model: PropTypes.object,
  journalId: PropTypes.string.isRequired
};

export default IssueForm;
