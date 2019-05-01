import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import FormContainer from "backend/containers/form";
import Layout from "backend/components/layout";
import Form from "backend/components/form";
import Navigation from "backend/components/navigation";
import { requests, resourceCollectionsAPI, projectsAPI } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { select } from "utils/entityUtils";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

export class ResourceCollectionNewContainer extends PureComponent {
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

  static displayName = "ResourceCollection.New";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    resourceCollection: PropTypes.object
  };

  redirectToCollection(resourceCollection) {
    const path = lh.link("backendResourceCollection", resourceCollection.id);
    this.props.history.push(path);
  }

  handleSuccess = resourceCollection => {
    this.redirectToCollection(resourceCollection);
  };

  render() {
    const { project } = this.props;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability="createResourceCollections"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <div>
          <Navigation.DetailHeader
            type="resourceCollection"
            backUrl={lh.link("backendProjectResourceCollections", project.id)}
            backLabel={project.attributes.titlePlaintext}
            title="New Collection"
            showUtility={false}
            note="Enter a name and a brief description. Press save to continue."
          />
          <Layout.BackendPanel>
            <FormContainer.Form
              model={this.props.resourceCollection}
              name={requests.beResourceCollectionCreate}
              update={resourceCollectionsAPI.update}
              create={model => resourceCollectionsAPI.create(project.id, model)}
              onSuccess={this.handleSuccess}
              className="form-secondary"
            >
              <Form.TextInput
                label="Title"
                name="attributes[title]"
                focusOnMount
                placeholder="Enter a title"
                {...this.props}
              />
              <Form.TextArea
                label="Description"
                name="attributes[description]"
                placeholder="Enter a description"
                {...this.props}
              />
              <Form.Upload
                layout="landscape"
                accepts="images"
                label="Cover Image"
                readFrom="attributes[thumbnailStyles][small]"
                name="attributes[thumbnail]"
                remove="attributes[removeThumbnail]"
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

export default connectAndFetch(ResourceCollectionNewContainer);
