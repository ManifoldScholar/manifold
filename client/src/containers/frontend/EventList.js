import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Project, ResourceList } from 'components/frontend';
import fakeData from 'helpers/fakeData';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectEventsContainer extends Component {
  static fetchData(getState, dispatch, location, params) {
    const projectRequest =
        request(projectsAPI.show(params.id), requests.showProjectDetail);
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.showProjectDetail, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    return (
      <Project.Events project={project} events={fakeData.events} />
    );
  }
}

const ProjectEvents = connect(
    ProjectEventsContainer.mapStateToProps
)(ProjectEventsContainer);

export default ProjectEvents;
