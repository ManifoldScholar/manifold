import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Metadata from "backend/components/metadata";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/Authorize";

export default class ProjectMetadataContainer extends PureComponent {
  static displayName = "Project.Metadata";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <Metadata.Form
          model={project}
          name="backend-project-general"
          update={projectsAPI.update}
          create={projectsAPI.create}
          className="form-secondary"
        />
      </Authorize>
    );
  }
}
