import React, { Component, PropTypes } from 'react';
import { Form, Text } from 'components/backend';
import { projectsAPI, requests } from 'api';
import { Form as FormContainer } from 'containers/backend';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import get from 'lodash/get';

const { request, flush } = entityStoreActions;

class ProjectDetailCollaborators extends Component {

  static displayName = "ProjectDetail.Collaborators";
  static activeNavItem = "collaborators";

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

