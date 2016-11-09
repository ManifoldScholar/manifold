import React, { Component, PropTypes } from 'react';
import { Project } from 'components/backend';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select } = entityUtils;
const { visibilityShow } = uiVisibilityActions;
const { request, flush, requests } = entityStoreActions;

class BackendProjectPanelGeneralContainer extends Component {

  static displayName = "BackendProjectPanel.General";

  // Used to hoist active state back up to parent container with navigation
  static activeNavItem = "general";

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

  static propTypes = {};

  render() {
    const General = Project.Panel.General;
    if (!this.props.project) return null;
    return (
      <General.Wrapper
        project={this.props.project}
      />
    );
  }
}

const BackendProjectPanelGeneral = connect(
    BackendProjectPanelGeneralContainer.mapStateToProps
)(BackendProjectPanelGeneralContainer);

export default BackendProjectPanelGeneral;
