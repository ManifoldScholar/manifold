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
              model={this.props.project}
              name="backend-create-project"
              update={projectsAPI.update}
              create={projectsAPI.create}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
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
                label="Description"
                name="attributes[description]"
                height={100}
              />
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
