import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import ProjectCollection from "backend/components/project-collection";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import lh from "helpers/linkHandler";

import Authorize from "hoc/Authorize";

class ProjectCollectionNew extends PureComponent {
  static displayName = "ProjectCollection.New";

  static propTypes = {
    buildUpdateProjectCollection: PropTypes.func.isRequired,
    buildCreateProjectCollection: PropTypes.func.isRequired,
    handleNewSuccess: PropTypes.func.isRequired,
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.model = this.defaultModel;
  }

  get defaultModel() {
    return {
      attributes: {
        numberOfProjects: 8,
      },
      relationships: {
        subjects: [],
      },
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
            onSuccess={this.props.handleNewSuccess}
            className="form-secondary project-collection-form"
          >
            <ProjectCollection.Form.Fields {...this.props} />
            <Form.Save
              text={this.props.t("project_collections.save_button_label")}
            />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}

export default withTranslation()(ProjectCollectionNew);
