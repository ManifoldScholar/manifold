import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Project } from 'components/frontend';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { projectsAPI, requests } from 'api';

const { request, flush } = entityStoreActions;

export class ProjectDetailContainer extends Component {

  static fetchData(getState, dispatch, location, match) {
    const projectRequest =
      request(projectsAPI.show(match.params.id), requests.feProject);
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.feProject, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
  }

  render() {
    return <Project.Detail project={this.props.project} dispatch={this.props.dispatch} />;
  }

}

export default connectAndFetch(ProjectDetailContainer);
