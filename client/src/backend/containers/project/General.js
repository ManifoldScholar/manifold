import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Project from "backend/components/project";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { subjectsAPI, projectsAPI, tagsAPI } from "api";
import lh from "helpers/linkHandler";
import Authorize from "hoc/authorize";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;
import withDispatch from "hoc/with-dispatch";
import isString from "lodash/isString";

class ProjectGeneralContainer extends PureComponent {
  static displayName = "Project.General";

  static propTypes = {
    project: PropTypes.object
  };

  newSubject = value => {
    const subject = {
      type: "subject",
      attributes: {
        name: value
      }
    };
    const call = subjectsAPI.create(subject);
    const subjectRequest = request(call, `create-subject`);
    const { promise } = this.props.dispatch(subjectRequest);
    return promise.then(({ data }) => data);
  };

  render() {
    const project = this.props.project;

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
            <Form.FieldGroup label="General">
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
              <Project.Form.AvatarBuilder
                wide
                project={project}
                {...this.props}
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Taxonomy">
              <Form.Picker
                label="Subjects"
                listStyle={"well"}
                name="relationships[subjects]"
                options={subjectsAPI.index}
                optionToLabel={subject => subject.attributes.name}
                newToValue={this.newSubject}
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
                beforeSetValue={tags =>
                  Array.isArray(tags) ? tags.join(",") : tags
                }
                beforeGetValue={tags => {
                  if (isString(tags)) {
                    if (tags.trim() === "") return [];
                    return tags.split(",");
                  }
                  return tags;
                }}
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
                instructions="Featured projects are highlighted on the home page."
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
                instructions="If the top bar is visible, this text will override the installation's top bar text"
              />
              <Form.TextInput
                label="Top Bar URL"
                name="attributes[standaloneModePressBarUrl]"
                instructions="If the top bar is visible, this text will override the top bar link URL"
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
}

export default withDispatch(ProjectGeneralContainer);
