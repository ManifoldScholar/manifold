import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Project from "backend/components/project";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ProjectGeneralContainer extends PureComponent {
  static displayName = "Project.General";

  static propTypes = {
    project: PropTypes.object
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
            model={this.props.project}
            name="backend-project-update"
            update={projectsAPI.update}
            create={projectsAPI.create}
            className="form-secondary"
          >
            <Form.FieldGroup label="General Attributes">
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
              <Form.Date
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
            <Form.FieldGroup label="Visibility">
              <Form.Switch
                className="form-toggle-secondary"
                label="Draft Mode"
                name="attributes[draft]"
                instructions="A draft project is only visible to users who are able to modify it."
              />
              <Form.Switch
                className="form-toggle-secondary"
                label="Featured"
                name="attributes[featured]"
                instructions="Featured projects are highlighted on the home page."
              />
              <Form.Select
                label="Standalone Mode"
                name="attributes[standaloneMode]"
                options={[
                  { value: "disabled", label: "Disabled" },
                  { value: "enabled", label: "Enabled" },
                  { value: "enforced", label: "Enforced" }
                ]}
                instructions={`If enabled, this project will always render in standalone
                mode when "?mode=standalone" is appended to the URL. If standalone mode
                is enforced, this project will always render in standalone mode`}
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Taxonomy">
              <Project.Form.Subjects wide project={project} {...this.props} />
              <Form.TagList
                label="Tags"
                name="attributes[tagList]"
                placeholder="Enter a Tag"
                wide
              />
            </Form.FieldGroup>
            <Form.FieldGroup
              label="Press Header Bar"
              instructions="Admin users can enabled the press bar for your installation on the settings / theme panel."
            >
              <Form.TextInput
                label="Press Header Bar Text"
                name="attributes[standaloneModePressBarText]"
                instructions="If the top bar is visible, this text will override the installation's top bar text"
              />
              <Form.TextInput
                label="Press Header Bar URL"
                name="attributes[standaloneModePressBarUrl]"
                instructions="If the top bar is visible, this text will override the top bar link URL"
              />
            </Form.FieldGroup>
            <Form.Save text="Save Project" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}
