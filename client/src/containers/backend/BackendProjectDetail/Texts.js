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

class BackendProjectPanelTextsContainer extends Component {

  static displayName = "BackendProjectPanel.Texts";

  // Used to hoist active state back up to parent container with navigation
  static activeNavItem = "texts";

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
    const Texts = Project.Panel.Texts;
    if (!this.props.project) return null;
    return (
      <Texts.Wrapper
        project={this.props.project}
      />
    );
  }
}

const BackendProjectPanelTexts = connect(
    BackendProjectPanelTextsContainer.mapStateToProps
)(BackendProjectPanelTextsContainer);

export default BackendProjectPanelTexts;
