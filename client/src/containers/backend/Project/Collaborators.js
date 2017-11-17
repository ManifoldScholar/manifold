import React, { Component } from "react";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { Form as FormContainer } from "containers/backend";
import { connect } from "react-redux";

export class ProjectCollaboratorsContainer extends Component {
  static displayName = "Project.Collaborators";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;

    return <FormContainer.Collaborators entity={project} api={projectsAPI} />;
  }
}

export default connect(ProjectCollaboratorsContainer.mapStateToProps)(
  ProjectCollaboratorsContainer
);
