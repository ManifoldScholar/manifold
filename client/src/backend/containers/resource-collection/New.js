import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import FormContainer from "global/containers/form";
import Layout from "backend/components/layout";
import Form from "global/components/form";
import Navigation from "backend/components/navigation";
import { requests, resourceCollectionsAPI, projectsAPI } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { select } from "utils/entityUtils";

import Authorize from "hoc/Authorize";

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
    resourceCollection: PropTypes.object,
    t: PropTypes.func
  };

  redirectToCollection(resourceCollection) {
    const path = lh.link("backendResourceCollection", resourceCollection.id);
    this.props.history.push(path);
  }

  handleSuccess = resourceCollection => {
    this.redirectToCollection(resourceCollection);
  };

  render() {
    const { project, t } = this.props;
    if (!project) return null;

    return (
      <Authorize
        entity={project}
        ability={"createResourceCollections"}
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <div>
          <Navigation.DetailHeader
            type="resourceCollection"
            backUrl={lh.link("backendProjectResourceCollections", project.id)}
            backLabel={project.attributes.titlePlaintext}
            title={t("backend_entities.resource_collections.forms.new_title")}
            showUtility={false}
            note={t(
              "backend_entities.resource_collections.forms.new_instructions"
            )}
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
                label={t(
                  "backend_entities.resource_collections.forms.title_label"
                )}
                name="attributes[title]"
                focusOnMount
                wide
                placeholder={t(
                  "backend_entities.resource_collections.forms.title_placeholder"
                )}
                {...this.props}
              />
              <Form.TextArea
                label={t(
                  "backend_entities.resource_collections.forms.descript_label"
                )}
                name="attributes[description]"
                placeholder={t(
                  "backend_entities.resource_collections.forms.descript_placeholder"
                )}
                wide
                {...this.props}
              />
              <Form.Upload
                layout="landscape"
                accepts="images"
                label={t(
                  "backend_entities.resource_collections.forms.image_label"
                )}
                readFrom="attributes[thumbnailStyles][small]"
                name="attributes[thumbnail]"
                remove="attributes[removeThumbnail]"
              />
              <Form.Save
                text={t("backend_entities.resource_collections.forms.new_save")}
                cancelRoute={lh.link("backendProjectResources", project.id)}
              />
            </FormContainer.Form>
          </Layout.BackendPanel>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(
  connectAndFetch(ResourceCollectionNewContainer)
);
