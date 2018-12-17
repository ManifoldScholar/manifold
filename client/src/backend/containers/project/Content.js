import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Content from "backend/components/project/Content";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ProjectContentContainer extends PureComponent {
  static displayName = "Project.ContentContainer";

  static propTypes = {
    project: PropTypes.object
  };

  // TODO: Pass the actual project to the Content component
  render() {
    const project = this.props.project;

    return (
      <Authorize
        entity={project}
        ability="update"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <Content dispatch={null} />
      </Authorize>
    );
  }
}
