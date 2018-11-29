import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import FormContainer from "backend/containers/form";
import Layout from "backend/components/layout";
import Form from "backend/components/form";
import Navigation from "backend/components/navigation";
import Resource from "backend/components/resource";
import GlobalForm from "global/components/form";
import { requests, projectsAPI, resourcesAPI } from "api";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

export class ResourceNewContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      project: select(requests.beProject, state.entityStore)
    };
  };

  static fetchData = (getState, dispatch, location, match) => {
    const promises = [];
    const projectCall = projectsAPI.show(match.params.projectId);
    const { promise: one } = dispatch(request(projectCall, requests.beProject));
    promises.push(one);
    return Promise.all(promises);
  };

  static displayName = "Resource.New";
  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.defaultResource = { attributes: { kind: "image" } };
  }

  redirectToResource(resource) {
    const path = lh.link("backendResource", resource.id);
    this.props.history.push(path);
  }

  handleSuccess = resource => {
    this.redirectToResource(resource);
  };

  render() {
    const { project } = this.props;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability={"createResources"}
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <div>
          <Navigation.DetailHeader
            type="resource"
            backUrl={lh.link("backendProjectResources", project.id)}
            backLabel={project.attributes.titlePlaintext}
            title={"New Resource"}
            showUtility={false}
            note={
              "Select your resource type, then enter a name and a brief description." +
              " Press save to continue."
            }
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              model={this.defaultResource}
              name="backend-resource-create"
              update={resourcesAPI.update}
              create={model => resourcesAPI.create(project.id, model)}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Resource.Form.KindPicker
                name="attributes[kind]"
                includeButtons
              />
              <Form.TextInput
                label="Title"
                name="attributes[title]"
                placeholder="Enter a resource title"
              />
              <Form.TextArea
                label="Description"
                name="attributes[description]"
                placeholder="Enter a description"
              />
              <Resource.Form.KindAttributes />
              <GlobalForm.Errorable
                className="form-input"
                name="attributes[fingerprint]"
              />
              <Form.Save
                text="Save and continue"
                cancelRoute={lh.link("backendProjectResources", project.id)}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default connectAndFetch(ResourceNewContainer);
