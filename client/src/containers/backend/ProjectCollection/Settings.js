import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form, ProjectCollection, Dialog } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { HigherOrder } from "containers/global";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;
const perPage = 12;

export class ProjectCollectionSettings extends PureComponent {
  static displayName = "ProjectCollection.Settings";

  static propTypes = {
    projectCollection: PropTypes.object,
    projectCollectionMeta: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = { confirmation: false };
  }

  handleDestroy = () => {
    const heading = "Are you sure you want to delete this project collection?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.destroyProjectCollection();
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  destroyProjectCollection() {
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
  }

  doAfterDestroy(props) {
    if (props.afterDestroy) return props.afterDestroy();
    return props.history.push(lh.link("backendProjectCollections"));
  }

  closeDialog() {
    this.setState({ confirmation: null });
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
      <HigherOrder.Authorize
        entity={projectCollection}
        ability="update"
        failureNotification
        failureRedirect={lh.link(
          "backendProjectCollection",
          projectCollection.id
        )}
      >
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <section>
          <FormContainer.Form
            model={projectCollection}
            name={requests.beProjectCollection}
            update={this.handleUpdate}
            create={projectCollectionsAPI.create}
            className="form-secondary project-collection-form"
            flushOnUnmount={false}
          >
            <div className="drawer-header">
              <Form.TextInput
                wide
                focusOnMount
                label="Collection Title:"
                name="attributes[title]"
                placeholder="Enter collection name"
              />
              <div className="buttons-bare-vertical">
                <button
                  className="button-bare-primary"
                  onClick={this.handleDestroy}
                  type="button"
                >
                  <i className="manicon manicon-trashcan" aria-hidden="true" />
                  {"Delete"}
                </button>
              </div>
            </div>
            <ProjectCollection.Form.KindPicker {...this.props} />
            <Form.TextArea
              wide
              label="Description:"
              name="attributes[description]"
              placeholder="Enter description"
            />
            <Form.Switch
              className="form-toggle-secondary"
              label="Visible:"
              name="attributes[visible]"
            />
            <Form.Switch
              className="form-toggle-secondary"
              label="Show on homepage:"
              name="attributes[homepage]"
            />
            <ProjectCollection.Form.IconPicker {...this.props} />
            <ProjectCollection.Form.SmartAttributes {...this.props} />
            <Form.Save text="Save Project Collection" />
          </FormContainer.Form>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(ProjectCollectionSettings.mapStateToProps)(
  ProjectCollectionSettings
);
