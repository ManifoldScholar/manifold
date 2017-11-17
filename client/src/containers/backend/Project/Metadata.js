import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Metadata } from "components/backend";
import { projectsAPI } from "api";

export default class ProjectMetadataContainer extends PureComponent {
  static displayName = "Project.Metadata";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    return (
      <Metadata.Form
        model={this.props.project}
        name="backend-project-general"
        update={projectsAPI.update}
        create={projectsAPI.create}
        className="form-secondary"
      />
    );
  }
}
