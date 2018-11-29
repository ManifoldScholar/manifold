import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import PermissionsContainer from "backend/containers/permission";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ProjectPermissionsContainer extends PureComponent {
  static displayName = "Project.PermissionsContainer";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;
    const closeUrl = lh.link("backendProjectPermissions", project.id);

    return (
      <Authorize
        entity={project}
        ability="managePermissions"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <PermissionsContainer.List entity={project} />
          {childRoutes(this.props.route, {
            drawer: true,
            drawerProps: { closeUrl },
            childProps: {
              entity: project,
              closeUrl,
              history: this.props.history
            }
          })}
        </section>
      </Authorize>
    );
  }
}