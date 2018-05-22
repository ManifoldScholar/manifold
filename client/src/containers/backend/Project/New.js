import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Navigation } from "components/backend";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { HigherOrder } from "containers/global";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

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
      <HigherOrder.Authorize
        entity={"project"}
        ability="create"
        failureNotification
        failureRedirect={lh.link("backend")}
      >
        <div>
          <Navigation.DetailHeader
            type="project"
            breadcrumb={[{ path: lh.link("backend"), label: "ALL PROJECTS" }]}
            title={"New Project"}
            showUtility={false}
            note={
              "Enter the name of your project, and a brief description. Press save to continue."
            }
          />
          <section className="backend-panel">
            <div className="container">
              <div className="panel">
                <section>
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
                      cancelRoute={lh.link("backend")}
                    />
                  </FormContainer.Form>
                </section>
              </div>
            </div>
          </section>
        </div>
      </HigherOrder.Authorize>
    );
  }
}

export default connectAndFetch(ProjectNewContainer);
