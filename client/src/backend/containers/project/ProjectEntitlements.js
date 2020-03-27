import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntitlementsContainer from "backend/containers/entitlements";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

import Authorize from "hoc/authorize";

export default class ProjectEntitlementsContainer extends PureComponent {
  static displayName = "Project.EntitlementsContainer";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;
    const closeUrl = lh.link("backendProjectEntitlements", project.id);

    return (
      <Authorize
        entity={project}
        ability="manageResources"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <EntitlementsContainer.List entity={project} />
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
