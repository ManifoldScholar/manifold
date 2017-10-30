import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form, Project } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { projectsAPI } from "api";

export default class ProjectPanelGeneral extends PureComponent {
  static displayName = "ProjectDetail.General";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;

    return (
      <section>
        <FormContainer.Form
          model={this.props.project}
          name="backend-project-update"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        >
          <Form.FieldGroup
            horizontal
            label="Project States"
            instructions="Draft projects are only visible to admins. Featured projects are highlighted on the home page."
          >
            <Form.Switch
              label="Draft Mode"
              labelClass="secondary"
              labelPos="below"
              name="attributes[draft]"
            />
            <Form.Switch
              label="Featured"
              labelClass="secondary"
              labelPos="below"
              name="attributes[featured]"
            />
          </Form.FieldGroup>
          <Form.TextInput
            validation={["required"]}
            focusOnMount
            label="Title"
            name="attributes[title]"
            placeholder="Enter Project Title"
          />
          <Form.TextInput
            label="Subtitle"
            name="attributes[subtitle]"
            placeholder="Enter Project Subtitle"
          />
          <Form.Date
            label="Publication Date"
            name="attributes[publicationDate]"
          />
          <Form.MaskedTextInput
            label="Hashtag"
            name="attributes[hashtag]"
            mask="hashtag"
          />
          <Project.Form.Subjects project={project} {...this.props} />
          <Project.Form.AvatarBuilder project={project} {...this.props} />
          <Form.Save text="Save Project" />
        </FormContainer.Form>
      </section>
    );
  }
}
