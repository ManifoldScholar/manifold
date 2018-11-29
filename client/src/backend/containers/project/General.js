import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Project from "backend/components/project";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
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
            <Form.FieldGroup label="Title">
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
              <Form.TextInput
                wide
                label="Slug"
                name="attributes[slug]"
                placeholder="Enter Project Slug"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Visibility">
              <Form.Switch
                className="form-toggle-secondary"
                label="Draft Mode"
                name="attributes[draft]"
                instructions="Draft projects are only visible to admins."
              />
              <Form.Switch
                className="form-toggle-secondary"
                label="Featured"
                name="attributes[featured]"
                instructions="Featured projects are highlighted on the home page."
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Social">
              <Form.MaskedTextInput
                label="Hashtag"
                name="attributes[hashtag]"
                mask="hashtag"
                placeholder="Enter Project Hashtag"
              />
              <Form.TextInput
                label="Facebook ID"
                name="attributes[facebookId]"
                placeholder="Enter Project Facebook ID"
              />
              <Form.TextInput
                label="Twitter ID"
                name="attributes[twitterId]"
                placeholder="Enter Project Twitter ID"
              />
              <Form.TextInput
                label="Instagram ID"
                name="attributes[instagramId]"
                placeholder="Enter Project Instagram ID"
              />
            </Form.FieldGroup>
            <Form.FieldGroup label="Other">
              <Form.Date
                label="Publication Date"
                name="attributes[publicationDate]"
              />
              <Project.Form.Subjects wide project={project} {...this.props} />
              <Form.TagList
                label="Tags"
                name="attributes[tagList]"
                placeholder="Enter a Tag"
                wide
              />
              <Project.Form.AvatarBuilder
                wide
                project={project}
                {...this.props}
              />
            </Form.FieldGroup>
            <Form.Save text="Save Project" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}
