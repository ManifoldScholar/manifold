import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Project, Navigation } from 'components/backend';
import { Form } from 'components/backend';
import { Form as FormContainer } from 'containers/backend';
import { notificationActions } from 'actions';
import { projectsAPI } from 'api';
import lh from 'helpers/linkHandler';

export class NewProjectWrapperContainer extends PureComponent {

  static displayName = "NewProject.WrapperContainer";

  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
  }

  redirectToProject(project) {
    const path = lh.link("backendProject", project.id);
    this.props.history.push(path);
  }

  handleSuccess(project) {
    this.redirectToProject(project);
  }

  render() {
    return (
      <div>
        <Navigation.DetailHeader
          type="project"
          breadcrumb={[
            { path: lh.link("backend"), label: "ALL PROJECTS" }
          ]}
          title={'New Project'}
          showUtility={false}
          note={'Enter the name of your project, and a brief description. Press save to continue.'}
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
    );
  }
}

export default connectAndFetch(NewProjectWrapperContainer);
