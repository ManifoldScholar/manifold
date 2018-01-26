import React, { Component } from "react";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { Form as FormContainer } from "containers/backend";
import { connect } from "react-redux";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

export class ProjectCollaboratorsContainer extends Component {
  static displayName = "Project.Collaborators";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const closeUrl = lh.link("backendProjectCollaborators", project.id);

    return (
      <section>
        <FormContainer.Collaborators
          entity={project}
          api={projectsAPI}
          history={this.props.history}
          route={this.props.route}
        />
        {childRoutes(this.props.route, {
          drawer: true,
          drawerProps: { closeUrl }
        })}
      </section>
    );
  }
}

export default connect(ProjectCollaboratorsContainer.mapStateToProps)(
  ProjectCollaboratorsContainer
);
