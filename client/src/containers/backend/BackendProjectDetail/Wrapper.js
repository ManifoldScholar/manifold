import React, { Component, PropTypes } from 'react';
import { Project, Layout } from 'components/backend';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { uiVisibilityActions, entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';
import get from 'lodash/get';

const { select } = entityUtils;
const { visibilityShow } = uiVisibilityActions;
const { request, flush, requests } = entityStoreActions;

class BackendWrapperContainer extends Component {
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
    children: PropTypes.object,
    project: PropTypes.object
  };

  activeChild() {
    return get(this.props, 'children.type.activeNavItem');
  }

  render() {
    return (
      <div>
        {
          this.props.project ?
          <Project.Header
            project={this.props.project}
          /> : null
        }
        <section>
          <div className="container">
            <section className="backend-panel">
              <aside>
                {
                  this.props.project ?
                  <Layout.PanelNav
                    project={this.props.project}
                    active={this.activeChild()}
                  /> : null
                }
              </aside>
              <div className="panel">
                {this.props.children}
              </div>
            </section>
          </div>
        </section>
      </div>
    );
  }
}

const BackendWrapper = connect(
    BackendWrapperContainer.mapStateToProps
)(BackendWrapperContainer);

export default BackendWrapper;

