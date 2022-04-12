import React, { useCallback } from "react";
import Project from "backend/components/project";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, journalVolumesAPI, projectsAPI, tagsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useApiCallback } from "hooks";

function ProjectPropertiesContainer({ project }) {
  const createSubject = useApiCallback(subjectsAPI.create);

  const createSubjectFromValue = useCallback(
    name => {
      return createSubject({ type: "subject", attributes: { name } });
    },
    [createSubject]
  );

  const { journal, journalIssue } = project.relationships;

  const fetchJournalVolumes = useCallback(() => {
    if (!journal) return [];
    return journalVolumesAPI.index(journal.id);
  }, [journal]);

  return (
    <Authorize
      entity={project}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <section>
        <FormContainer.Form
          model={project}
          name="backend-project-update"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        >
          <Form.FieldGroup label="Properties">
            <Form.TextInput
              wide
              validation={["required"]}
              focusOnMount
              label="Title"
              name="attributes[title]"
              placeholder="Enter Project Title"
            />
            <Form.TextInput
              wide
              label="Subtitle"
              name="attributes[subtitle]"
              placeholder="Enter Project Subtitle"
            />
            {journalIssue && (
              <>
                <Form.TextInput
                  label="Issue Number"
                  wide
                  name="attributes[journalIssueNumber]"
                />
                <Form.NumberInput
                  label="Issue Sort Number"
                  wide
                  name="attributes[journalIssuePendingSortTitle]"
                  placeholder="Enter sorting number"
                  instructions="This field is only used to numerically sort issues in lists. If blank, Manifold will attempt to derive a number from the issue number."
                />
                <Form.Picker
                  instructions="Optionally, select a volume."
                  wide
                  belongsTo
                  label="Volume Number"
                  name="relationships[journalVolume]"
                  optionToLabel={volume => volume.attributes.number}
                  predictive
                  listStyle={"rows"}
                  options={fetchJournalVolumes}
                />
              </>
            )}
            <Form.DatePicker
              label="Publication Date"
              name="attributes[publicationDate]"
            />
            <Form.TextInput
              wide
              label="Slug"
              name="attributes[pendingSlug]"
              placeholder="Enter Project Slug"
            />
            <Project.Form.AvatarBuilder wide project={project} />
          </Form.FieldGroup>
          <Form.FieldGroup label="Taxonomy">
            <Form.Picker
              label="Subjects"
              listStyle={"well"}
              name="relationships[subjects]"
              options={subjectsAPI.index}
              optionToLabel={subject => subject.attributes.name}
              newToValue={createSubjectFromValue}
              placeholder="Select a Subject"
              listRowComponent="SubjectRow"
            />

            <Form.Picker
              label="Tags"
              listStyle="well"
              listRowComponent="StringRow"
              name="attributes[tagList]"
              placeholder="Enter Tags"
              options={tagsAPI.index}
              optionToLabel={tag => tag.attributes.name}
              optionToValue={tag => tag.attributes.name}
              allowNew
            />
          </Form.FieldGroup>
          <Form.FieldGroup label="Presentation">
            <Form.Switch
              className="form-toggle-secondary"
              wide
              label="Draft Mode"
              name="attributes[draft]"
              instructions="A draft project is only visible to users who are able to modify it."
            />
            <Form.Switch
              className="form-toggle-secondary"
              wide
              label="Featured"
              name="attributes[featured]"
              instructions="Featured projects can be automatically included in smart project collections."
            />
            <Form.Switch
              className="form-toggle-secondary"
              wide
              label="Finished"
              name="attributes[finished]"
              instructions="In lists, Manifold will show the publication date for finished projects."
            />
            <Form.Select
              label="Standalone Mode"
              wide
              name="attributes[standaloneMode]"
              options={[
                { value: "disabled", label: "Standalone Mode Disabled" },
                { value: "enabled", label: "Standalone Mode Enabled" },
                { value: "enforced", label: "Standalone Mode Enforced" }
              ]}
              instructions={`If enabled, this project will always render in standalone
                mode when "?mode=standalone" is appended to the URL. If standalone mode
                is enforced, this project will always render in standalone mode`}
            />
            <Form.TextInput
              label="Top Bar Text"
              name="attributes[standaloneModePressBarText]"
              instructions="If set, the top bar will display and this text will override the installation's top bar text"
            />
            <Form.TextInput
              label="Top Bar URL"
              name="attributes[standaloneModePressBarUrl]"
              instructions="If the top bar is visible, this text will link to this URL"
            />
          </Form.FieldGroup>
          <Form.FieldGroup label="Restrictions">
            <Form.Switch
              className="form-toggle-secondary"
              wide
              label="Disable Public Annotations and Comments"
              name="attributes[disableEngagement]"
              instructions="When on, this setting will prevent users from commenting or annotating publicly on this project. Reading group annotations will only appear for group members."
            />
          </Form.FieldGroup>
          <Form.Save text="Save Project" />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

export default ProjectPropertiesContainer;
