import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/with-confirmation";
import ProjectCollection from "backend/components/project-collection";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;
const perPage = 12;

export class ProjectCollectionSettings extends PureComponent {
  static displayName = "ProjectCollection.Settings";

  static propTypes = {
    projectCollection: PropTypes.object,
    projectCollectionMeta: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  handleDestroy = () => {
    const heading = "Are you sure you want to delete this project collection?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.destroyProjectCollection);
  };

  destroyProjectCollection = () => {
    const projectCollection = this.props.projectCollection;
    const call = projectCollectionsAPI.destroy(projectCollection.id);
    const options = { removes: projectCollection };
    const destroyRequest = request(
      call,
      requests.beProjectCollectionDestroy,
      options
    );
    this.props.dispatch(destroyRequest).promise.then(() => {
      this.doAfterDestroy(this.props);
    });
  };

  doAfterDestroy(props) {
    if (props.afterDestroy) return props.afterDestroy();
    return props.history.push(lh.link("backendProjectCollections"));
  }

  shouldPaginate(model) {
    const { projectCollection } = this.props;
    return (
      model.attributes.smart || !projectCollection.attributes.manuallySorted
    );
  }

  handleUpdate = (id, model) => {
    const pagination = this.props.projectCollectionMeta.relationships
      .collectionProjects.pagination;
    const page = {};
    if (this.shouldPaginate(model))
      page.collectionProjects = {
        number: pagination.currentPage,
        size: perPage
      };
    return projectCollectionsAPI.update(id, model, page);
  };

  render() {
    const { projectCollection } = this.props;
    if (!projectCollection) return null;

    return (
      <Authorize
        entity={projectCollection}
        ability="update"
        failureNotification
        failureRedirect={lh.link(
          "backendProjectCollection",
          projectCollection.id
        )}
      >
        <section>
          <FormContainer.Form
            model={projectCollection}
            name={requests.beProjectCollection}
            update={this.handleUpdate}
            create={projectCollectionsAPI.create}
            className="form-secondary project-collection-form"
            flushOnUnmount={false}
          >
            <ProjectCollection.Form.Fields
              handleDestroy={this.handleDestroy}
              {...this.props}
            />
            <Form.Save text="Save Project Collection" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}

export default withConfirmation(
  connect(ProjectCollectionSettings.mapStateToProps)(ProjectCollectionSettings)
);
