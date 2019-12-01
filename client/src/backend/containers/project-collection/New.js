import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import ProjectCollection from "backend/components/project-collection";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ProjectCollectionNew extends PureComponent {
  static displayName = "ProjectCollection.New";

  static propTypes = {
    buildUpdateProjectCollection: PropTypes.func.isRequired,
    buildCreateProjectCollection: PropTypes.func.isRequired,
    successHandler: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.model = this.defaultModel;
  }

  get defaultModel() {
    return {
      attributes: {
        numberOfProjects: 8
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
            update={this.props.buildUpdateProjectCollection}
            create={this.props.buildCreateProjectCollection}
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
