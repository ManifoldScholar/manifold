import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HigherOrder, FatalError } from 'components/global';
import HigherOrderContainers from 'containers/global/HigherOrder';
import { Layout } from 'components/frontend';
import { commonActions } from 'actions/helpers';
import { pagesAPI, subjectsAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import { select, isLoaded } from 'utils/entityUtils';
import connectAndFetch from 'utils/connectAndFetch';
import { renderRoutes } from 'react-router-config';

const { request } = entityStoreActions;

export class FrontendContainer extends Component {

  static fetchData(getState, dispatch) {
    if (!isLoaded(requests.gPages, getState())) {
      const pages = request(pagesAPI.index(), requests.gPages, { oneTime: true });
      const subjects = request(
        subjectsAPI.index({ used: true }),
        requests.feSubjects,
        { oneTime: true }
      );
      const { promise: one } = dispatch(pages);
      const { promise: two } = dispatch(subjects);
      return Promise.all([one, two]);
    }
  }

  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object,
    history: PropTypes.object.isRequired,
    pages: PropTypes.array,
    settings: PropTypes.object,
    route: PropTypes.object
  };

  static mapStateToProps(state) {
    return {
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      pages: select(requests.gPages, state.entityStore),
      settings: select(requests.settings, state.entityStore)
    };
  }

  componentWillMount() {
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    this.setMinHeight();
  }

  setMinHeight() {
    if (!this.refs.mainContainer) return;
    const mainHeight = this.refs.mainContainer.offsetHeight;
    const offsetHeight = this.refs.mainContainer.parentNode.offsetHeight - mainHeight;
    this.refs.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  render() {
    const fatalError = this.props.notifications.fatalError;
    return (
      <HigherOrder.BodyClass className={'browse'}>
        <div>
          <HigherOrder.ScrollAware>
            <Layout.Header
              visibility={this.props.visibility }
              location={this.props.location}
              authentication={this.props.authentication}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              settings={this.props.settings}
            />
          </HigherOrder.ScrollAware>
          <HigherOrderContainers.RequireRole requiredRole="any">
            <Layout.MobileNav location={this.props.location} />
          </HigherOrderContainers.RequireRole>
          <main ref="mainContainer">
            { (fatalError) ?
              <div className="global-container">
                <FatalError error={fatalError} />
              </div>
              :
              <div>
                {renderRoutes(this.props.route.routes)}
              </div>
            }
          </main>
          <Layout.Footer
            pages={this.props.pages}
            authentication={this.props.authentication}
            commonActions={this.commonActions}
            settings={this.props.settings}
          />
        </div>
      </HigherOrder.BodyClass>
    );
  }
}

export default connectAndFetch(FrontendContainer);
