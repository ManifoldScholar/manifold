import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connectAndFetch from 'utils/connectAndFetch';
import { HigherOrder, FatalError } from 'components/global';
import { Layout as LayoutFrontend } from 'components/frontend';
import { Layout as LayoutBackend } from 'components/backend';
import { NotFound } from 'containers/frontend';
import { commonActions } from 'actions/helpers';
import { pagesAPI, requests } from 'api';
import { entityStoreActions } from 'actions';
import entityUtils from 'utils/entityUtils';
import { Switch, Route } from 'react-router-dom';
import { renderRoutes } from 'helpers/routing';
const { request } = entityStoreActions;

export class BackendContainer extends PureComponent {

  static fetchData(getState, dispatch) {
    if (!entityUtils.isLoaded(requests.gPages, getState())) {
      const pages = request(pagesAPI.index(), requests.gPages, { oneTime: true });
      const { promise: one } = dispatch(pages);
      return Promise.all([one]);
    }
  }

  static propTypes = {
    routeDataLoaded: PropTypes.bool,
    children: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    loading: PropTypes.bool,
    notifications: PropTypes.object,
    history: PropTypes.object.isRequired,
    pages: PropTypes.array
  };

  static mapStateToProps(state) {
    return {
      authentication: state.authentication,
      visibility: state.ui.visibility,
      loading: state.ui.loading.active,
      notifications: state.notifications,
      routing: state.routing,
      pages: entityUtils.select(requests.gPages, state.entityStore),
      settings: entityUtils.select(requests.settings, state.entityStore)
    };
  }

  componentWillMount() {
    this.commonActions = commonActions(this.props.dispatch);
  }

  componentDidMount() {
    this.setMinHeight();
  }

  setMinHeight() {
    const mainHeight = this.refs.mainContainer.offsetHeight;
    const offsetHeight = this.refs.mainContainer.parentNode.offsetHeight - mainHeight;
    this.refs.mainContainer.style.minHeight = `calc(100vh - ${offsetHeight}px)`;
  }

  renderError(error) {
    return (
      <div className="global-container">
        <FatalError error={error} />
      </div>
    );
  }

  renderFatalError() {
    return this.renderError(this.props.notifications.fatalError);
  }

  renderAuthenticationError() {
    return this.renderError({
      status: null,
      detail: "Please login to access the backend.",
      title: "Login Required"
    });
  }

  hasFatalError() {
    return !!this.props.notifications.fatalError;
  }

  hasAuthenticationError() {
    return !this.props.authentication.authenticated;
  }

  render() {
    if (this.hasFatalError()) return this.renderFatalError();
    if (this.hasAuthenticationError()) return this.renderAuthenticationError();

    return (
      <HigherOrder.BodyClass className={'backend bg-neutral90'}>
        <div>
          <HigherOrder.ScrollAware>
            <LayoutBackend.Header
              visibility={this.props.visibility}
              location={this.props.location}
              authentication={this.props.authentication}
              notifications={this.props.notifications}
              commonActions={this.commonActions}
              settings={this.props.settings}
            />
          </HigherOrder.ScrollAware>
          <main ref="mainContainer">
            {renderRoutes(this.props.route.routes)}
          </main>
          <LayoutFrontend.Footer
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

export default connectAndFetch(BackendContainer);
