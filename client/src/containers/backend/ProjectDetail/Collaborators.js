import React, { Component, PropTypes } from 'react';
import { projectsAPI } from 'api';
import { Form as FormContainer } from 'containers/backend';
import { connect } from 'react-redux';


class ProjectDetailCollaborators extends Component {

  static displayName = "ProjectDetail.Collaborators";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;

    return (
      <FormContainer.Collaborators entity={project} api={projectsAPI} />
    );
  }
}

export default connect(
  ProjectDetailCollaborators.mapStateToProps
)(ProjectDetailCollaborators);
