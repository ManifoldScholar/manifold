import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ProjectCollection from "backend/components/project-collection";
import Form from "backend/components/form";
import FormContainer from "backend/containers/form";
import { projectCollectionsAPI } from "api";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export class ProjectCollectionNew extends PureComponent {
  static displayName = "ProjectCollection.New";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    successHandler: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = { confirmation: false };
    this.model = this.defaultModel();
  }

  defaultModel() {
    return {
      attributes: {
        numberOfProjects: 0
      },
      relationships: {
        subjects: []
      }
    };
  }

  render() {
    return (
      <Authorize
        entity="projectCollection"
        ability="create"
        failureNotification
        failureRedirect={lh.link("backendProjectCollections")}
      >
        <section>
          <FormContainer.Form
            model={this.model}
            name="backend-project-collection-create"
            update={projectCollectionsAPI.update}
            create={projectCollectionsAPI.create}
            onSuccess={this.props.successHandler}
            className="form-secondary project-collection-form"
          >
            <div className="drawer-header">
              <Form.TextInput
                wide
                focusOnMount
                label="Collection Title:"
                name="attributes[title]"
                placeholder="Enter collection name"
              />
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
      </Authorize>
    );
  }
}

export default connect(ProjectCollectionNew.mapStateToProps)(
  ProjectCollectionNew
);