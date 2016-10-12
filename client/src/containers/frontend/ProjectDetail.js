import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Project } from 'components/frontend';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select } = entityUtils;
const { visibilityShow } = uiVisibilityActions;
const { request, flush, requests } = entityStoreActions;

class ProjectDetailContainer extends Component {

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
    project: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    return <Project.Detail project={this.props.project} dispatch={this.props.dispatch} />;
  }


}

const ProjectDetail = connect(
  ProjectDetailContainer.mapStateToProps
)(ProjectDetailContainer);

export default ProjectDetail;
