import React, { Component } from "react";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { Form as FormContainer } from "containers/backend";
import { connect } from "react-redux";
import { childRoutes } from "helpers/router";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";

export class ProjectCollaboratorsContainer extends Component {
  static displayName = "Project.Collaborators";

  static propTypes = {
    project: PropTypes.object,
    history: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    route: PropTypes.object
  };

  closeUrl(props) {
    return lh.link("backendProjectCollaborators", props.project.id);
  }

  close = () => {
    this.props.refresh();
    this.props.history.push(this.closeUrl(this.props));
  };

  render() {
    const project = this.props.project;
    const closeUrl = this.closeUrl(this.props);

    return (
      <HigherOrder.Authorize
        entity={project}
        ability="updateMakers"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <FormContainer.Collaborators
            entity={project}
            api={projectsAPI}
            history={this.props.history}
            route={this.props.route}
          />
          {childRoutes(this.props.route, {
            drawer: true,
            drawerProps: { closeUrl },
            childProps: { afterDestroy: this.close }
          })}
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(ProjectCollaboratorsContainer.mapStateToProps)(
  ProjectCollaboratorsContainer
);
