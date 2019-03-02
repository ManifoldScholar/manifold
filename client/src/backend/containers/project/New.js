import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Layout from "backend/components/layout";
import Navigation from "backend/components/navigation";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export class ProjectNewContainer extends PureComponent {
  static displayName = "Project.New";

  static propTypes = {
    history: PropTypes.object,
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.defaultProject = {
      attributes: {
        configuration: {
          multipleTexts: true,
          resources: true,
          markdown: true,
          recentActivity: true
        }
      }
    };
  }

  // TODO: Update documentation link when content block docs are added
  get layoutInstructions() {
    return (
      <span className="instructions">
        {`Your project's appearance is modular and highly customizable. The
        following prompts are to help you get started. If you're unsure of your
        answers, don't worry, everything can be changed later. Learn more about
        these Layout options `}
        <a
          href="https://manifoldapp.org/docs/projects/customizing/appearance"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        {`.`}
      </span>
    );
  }

  redirectToProject(project) {
    const path = lh.link("backendProject", project.id);
    this.props.history.push(path);
  }

  handleSuccess = project => {
    this.redirectToProject(project);
  };

  render() {
    return (
      <Authorize
        entity={"project"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <div>
          <Navigation.DetailHeader
            type="project"
            title={"New Project"}
            showUtility={false}
            note={
              "Enter the name of your project, and a brief description. Press save to continue."
            }
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              model={this.defaultProject}
              name="backend-create-project"
              update={projectsAPI.update}
              create={projectsAPI.create}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Form.FieldGroup label="Title and Description">
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
                <Form.TextArea
                  label="Brief Description"
                  name="attributes[description]"
                  height={100}
                  wide
                />
              </Form.FieldGroup>
              <Form.FieldGroup
                label="Layout"
                instructions={this.layoutInstructions}
              >
                <Form.Radios
                  label="Texts"
                  prompt="Will your project include more than one text?"
                  name="attributes[configuration][multipleTexts]"
                  instructions={
                    "Manifold projects can include a single text or multiple texts."
                  }
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label="Resources"
                  prompt="Do you have resources you want to add in addition to any texts you are loading?"
                  name="attributes[configuration][resources]"
                  instructions={
                    "Enhance your texts with media or create a project composed only of media resources."
                  }
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label="Extended Description"
                  prompt="Do you need additional space to describe your project?"
                  name="attributes[configuration][markdown]"
                  instructions={
                    "A freeform content block can be used to add text contextualizing your project."
                  }
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                  ]}
                  inline
                  wide
                />
                <Form.Radios
                  label="Activity"
                  prompt="Will your project change frequently?"
                  name="attributes[configuration][recentActivity]"
                  instructions={
                    "Manifold can showcase the evolution of your project on the platform and in the Twitterverse."
                  }
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                  ]}
                  inline
                  wide
                />
              </Form.FieldGroup>
              <Form.Save
                text="Save and Continue"
                cancelRoute={lh.link("backendProjects")}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default connectAndFetch(ProjectNewContainer);
