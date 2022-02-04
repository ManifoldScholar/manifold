import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Project from "backend/components/project";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, tagsAPI, journalsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useApiCallback } from "hooks";

function JournalPropertiesContainer({ journal }) {
  const createSubject = useApiCallback(subjectsAPI.create);

  const createSubjectFromValue = useCallback(
    name => {
      return createSubject({ type: "subject", attributes: { name } });
    },
    [createSubject]
  );

  return (
    <Authorize
      entity={journal}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendJournal", journal.id)}
    >
      <section>
        <FormContainer.Form
          model={journal}
          name="backend-journal-update"
          update={journalsAPI.update}
          create={journalsAPI.create}
          className="form-secondary"
        >
          <Form.FieldGroup label="Properties">
            <Form.TextInput
              wide
              validation={["required"]}
              focusOnMount
              label="Title"
              name="attributes[title]"
              placeholder="Enter Journal Title"
            />
            <Form.TextInput
              wide
              label="Subtitle"
              name="attributes[subtitle]"
              placeholder="Enter Journal Subtitle"
            />
            <Form.TextInput
              wide
              label="Slug"
              name="attributes[pendingSlug]"
              placeholder="Enter Journal Slug"
            />
            <Project.Form.AvatarBuilder wide />
          </Form.FieldGroup>
          <Form.FieldGroup label="Presentation">
            <Form.Switch
              className="form-toggle-secondary"
              wide
              label="Draft Mode"
              name="attributes[draft]"
              instructions="A draft project is only visible to users who are able to modify it."
            />
          </Form.FieldGroup>
          <Form.FieldGroup label="Social">
            <Form.TextInput
              label="Social Card Title"
              name="attributes[socialTitle]"
              placeholder="Optionally, Enter a Social Card Title"
            />
            <Form.TextArea
              wide
              label="Social Card Description"
              name="attributes[socialDescription]"
              placeholder="Optionally, Enter a Social Card Description"
            />
            <Form.Upload
              layout="portrait"
              label="Social Card Image"
              accepts="images"
              readFrom="attributes[socialImageStyles][small]"
              name="attributes[socialImage]"
              remove="attributes[removeSocialImage]"
            />
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
          <Form.Save text="Save Journal" />
        </FormContainer.Form>
      </section>
    </Authorize>
  );
}

JournalPropertiesContainer.propTypes = {
  journal: PropTypes.object
};

export default JournalPropertiesContainer;
