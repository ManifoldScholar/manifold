import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import withConfirmation from "hoc/with-confirmation";
import ProjectCollection from "backend/components/project-collection";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { projectCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export class ProjectCollectionSettings extends PureComponent {
  static displayName = "ProjectCollection.Settings";

  static propTypes = {
    projectCollection: PropTypes.object,
    projectCollectionMeta: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    buildUpdateProjectCollection: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  handleDestroy = () => {
    const heading = "Are you sure you want to delete this project collection?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.props.destroyProjectCollection);
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
            name={requests.beProjectCollectionUpdate}
            update={this.props.buildUpdateProjectCollection}
            create={projectCollectionsAPI.create}
            onSuccess={this.props.refreshCollectionProjects}
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

export default withConfirmation(ProjectCollectionSettings);
