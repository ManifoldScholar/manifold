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
    this.model = this.defaultModel;
  }

  get defaultModel() {
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
            <ProjectCollection.Form.Fields {...this.props} />
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
